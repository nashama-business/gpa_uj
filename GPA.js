const gradePoints = {
  'أ': 4.00,
  'أ-': 3.75,
  'ب+': 3.50,
  'ب': 3.00,
  'ب-': 2.75,
  'ج+': 2.50,
  'ج': 2.00,
  'ج-': 1.75,
  'د+': 1.50,
  'د': 1.25,
  'د-': 1.00,
  'هـ': 0.50
};

// إضافة متغيرات لتتبع تغييرات عدد المواد
let courseCountChanges = 0;
const MAX_COURSE_COUNT_CHANGES = 3;

function initializeButtonGroups() {
  const buttonGroups = document.querySelectorAll('.button-group');
  
  const selectedValues = new Map();

  buttonGroups.forEach(group => {
    const buttons = group.querySelectorAll('.option-button');
    const groupId = group.id;
    
    const savedValue = localStorage.getItem(groupId);
    
    buttons.forEach(button => {
      if (savedValue === button.dataset.value) {
        button.classList.add('selected');
      }
      
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        
        selectedValues.set(groupId, button.dataset.value);
        localStorage.setItem(groupId, button.dataset.value);

        if (groupId === 'courseCount') {
          // زيادة عداد تغييرات عدد المواد
          courseCountChanges++;
          
          // التحقق من تجاوز الحد المسموح
          if (courseCountChanges > MAX_COURSE_COUNT_CHANGES) {
            // إزالة الكاش وتحديث الصفحة مباشرة
            localStorage.clear();
            window.location.reload();
          } else {
            updateCoursesUI();
          }
        }
      });
    });
  });
}

function getSelectedValue(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return null;
  const selectedButton = group.querySelector('.option-button.selected');
  return selectedButton ? selectedButton.dataset.value : null;
}

const isFirstSemesterGroup = document.getElementById('isFirstSemester');
const previousDataSection = document.getElementById('previousDataSection');
const courseCountGroup = document.getElementById('courseCount');
const coursesContainer = document.getElementById('coursesContainer');
const calculateButton = document.getElementById('calculateButton');
const resetButton = document.getElementById('resetButton');
const resultSection = document.getElementById('resultSection');
const studentStatusSection = document.getElementById('studentStatusSection');
const studentStatusGroup = document.getElementById('studentStatus');
const semesterTypeGroup = document.getElementById('semesterType');
const isFirstMajorGroup = document.getElementById('isFirstMajor');

isFirstSemesterGroup.addEventListener('click', () => {
  const isFirst = getSelectedValue('isFirstSemester') === 'yes';
  previousDataSection.classList.toggle('hidden', isFirst);
  studentStatusSection.classList.toggle('hidden', isFirst);
  toggleRepeatedOptions();
});

let courses = [];

function updateCoursesUI() {
  const count = parseInt(getSelectedValue('courseCount')) || 4;
  const fragment = document.createDocumentFragment();
  courses = [];

  for (let i = 1; i <= count; i++) {
    const coursesection = document.createElement('section');
    coursesection.classList.add('course');
    
    coursesection.innerHTML = `
      <h3>
        <span class="course-name">المادة ${i}</span>
        <input type="text" class="course-name-input hidden" placeholder="أدخل اسم المادة">
      </h3>
      <label><i class="fas fa-font"></i> رمز المادة</label>
      <div class="button-group course-code" id="course-code-${i}">
        ${generateGradeButtons()}
      </div>

      <label><i class="fas fa-clock"></i> عدد الساعات</label>
      <div class="button-group course-hours" id="course-hours-${i}">
        ${generateHoursButtons()}
      </div>

      <section class="repeated-course hidden">
        <label><i class="fas fa-redo-alt"></i> هل المادة معادة؟</label>
        <div class="button-group course-repeated" id="course-repeated-${i}">
          <button class="option-button selected" data-value="no">لا</button>
          <button class="option-button" data-value="yes">نعم</button>
        </div>

        <section class="old-course hidden">
          <label><i class="fas fa-tag"></i> رمز المادة القديمة:</label>
          <div class="button-group old-course-code" id="old-course-code-${i}">
            ${generateOldGradeButtons()}
          </div>
        </section>
      </section>
    `;
    
    fragment.appendChild(coursesection);
    
    courses.push({
      name: coursesection.querySelector('.course-name'),
      code: coursesection.querySelector('.course-code'),
      hours: coursesection.querySelector('.course-hours'),
      repeated: coursesection.querySelector('.course-repeated'),
      oldCode: coursesection.querySelector('.old-course-code')
    });
  }

  coursesContainer.innerHTML = '';
  coursesContainer.appendChild(fragment);
  
  initializeButtonGroups();
  toggleRepeatedOptions();
  enableCourseNameEditing();
}

function generateGradeButtons() {
  return Object.keys(gradePoints)
    .map(grade => `<button class="option-button ${grade === 'أ' ? 'selected' : ''}" data-value="${grade}">${grade}</button>`)
    .join('');
}

function generateHoursButtons() {
  return [1, 2, 3, 4, 5, 6]
    .map(hours => `<button class="option-button ${hours === 3 ? 'selected' : ''}" data-value="${hours}">${hours}</button>`)
    .join('');
}

function generateOldGradeButtons() {
  return ['ج+', 'ج', 'ج-', 'د+', 'د', 'د-', 'هـ']
    .map(grade => `<button class="option-button" data-value="${grade}">${grade}</button>`)
    .join('');
}

function toggleRepeatedOptions() {
  const isFirstSemester = getSelectedValue('isFirstSemester') === 'yes';
  const repeatedsections = document.querySelectorAll('.repeated-course');

  repeatedsections.forEach(section => {
    if (isFirstSemester) {
      section.classList.add('hidden');
    } else {
      section.classList.remove('hidden');
    }
  });
}

function showError(message, elementId = null) {
  const existingErrors = document.querySelectorAll('.error-message-inline');
  existingErrors.forEach(error => error.remove());

  const errorInputs = document.querySelectorAll('.input-error');
  errorInputs.forEach(input => input.classList.remove('input-error'));

  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('input-error');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message-inline';
      errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
      `;
      
      element.parentNode.insertBefore(errorDiv, element.nextSibling);
      
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      setTimeout(() => {
        errorDiv.remove();
        element.classList.remove('input-error');
      }, 3000);
    }
  } else {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}

function calculateGPA() {
  const isFirstSemester = getSelectedValue('isFirstSemester') === 'yes';
  let previousGPA = parseFloat(document.getElementById('previousGPA').value) || 0;
  let previousHours = parseInt(document.getElementById('previousHours').value) || 0;

  if (!validateInputs(isFirstSemester, previousGPA, previousHours)) {
    return;
  }

  const results = calculateResults(isFirstSemester, previousGPA, previousHours);
  
  displayResult(
    results.newGPA,
    results.totalHours,
    results.newCourses,
    results.previousGPA,
    results.previousHours,
    results.semesterGPA,
    results.semesterHours,
    results.finalStatus
  );

  saveResults(results);
}

function validateInputs(isFirstSemester, previousGPA, previousHours) {
  if (!isFirstSemester) {
    if (isNaN(previousGPA) || previousGPA < 0.5 || previousGPA > 4 || !/^\d+(\.\d{1,2})?$/.test(previousGPA)) {
      showError('يرجى إدخال معدل تراكمي صحيح', 'previousGPA');
      return false;
    }

    if (isNaN(previousHours) || previousHours <= 0 || !Number.isInteger(previousHours)) {
      showError('يرجى إدخال عدد ساعات صحيح', 'previousHours');
      return false;
    }
  }
  return true;
}

function calculateResults(isFirstSemester, previousGPA, previousHours) {
  let totalPoints = previousGPA * previousHours;
  let totalHours = previousHours;
  let semesterPoints = 0;
  let semesterHours = 0;
  const newCourses = [];

  for (const course of courses) {
    const courseResult = calculateCourseResult(course);
    if (!courseResult) return null;

    const { hours, gradeValue, isRepeated, oldGradeValue } = courseResult;

    if (isRepeated) {
      if (gradeValue > oldGradeValue) {
        totalPoints -= oldGradeValue * hours;
        totalPoints += gradeValue * hours;
        semesterPoints += gradeValue * hours;
        semesterHours += hours;
      }
    } else {
      totalPoints += gradeValue * hours;
      totalHours += hours;
      semesterPoints += gradeValue * hours;
      semesterHours += hours;
    }

    newCourses.push({
      name: course.name.textContent,
      code: getSelectedValue(course.code.id),
      hours: hours,
      gradeValue: gradeValue,
      oldCode: isRepeated ? getSelectedValue(course.oldCode.id) : ''
    });
  }

  const newGPA = totalPoints / totalHours;
  const semesterGPA = semesterPoints / semesterHours;
  const finalStatus = calculateStudentStatus(newGPA, isFirstSemester);

  return {
    newGPA,
    totalHours,
    newCourses,
    previousGPA,
    previousHours,
    semesterGPA,
    semesterHours,
    finalStatus
  };
}

function calculateCourseResult(course) {
  const hours = parseInt(getSelectedValue(course.hours.id));
  const grade = getSelectedValue(course.code.id);
  const isRepeated = getSelectedValue(course.repeated.id) === 'yes';
  const oldCode = getSelectedValue(course.oldCode.id);

  if (isNaN(hours) || hours <= 0) {
    showError('يرجى إدخال عدد ساعات صحيح لكل مادة', course.hours.id);
    return null;
  }

  const gradeValue = gradePoints[grade];
  if (gradeValue === undefined) {
    showError('يرجى إدخال رمز مادة صحيح', course.code.id);
    return null;
  }

  if (isRepeated) {
    const oldGradeValue = gradePoints[oldCode];
    if (oldGradeValue === undefined) {
      showError('يرجى إدخال رمز مادة قديمة صحيح', course.oldCode.id);
      return null;
    }
    return { hours, gradeValue, isRepeated, oldGradeValue };
  }

  return { hours, gradeValue, isRepeated: false };
}

function saveResults(results) {
  localStorage.setItem('lastResults', JSON.stringify(results));
}

function loadSavedResults() {
  const savedResults = localStorage.getItem('lastResults');
  if (savedResults) {
    const results = JSON.parse(savedResults);
    displayResult(
      results.newGPA,
      results.totalHours,
      results.newCourses,
      results.previousGPA,
      results.previousHours,
      results.semesterGPA,
      results.semesterHours,
      results.finalStatus
    );
  }
}

function calculateStudentStatus(newGPA, isFirstSemester) {
  const studentStatus = getSelectedValue('studentStatus');
  const semesterType = getSelectedValue('semesterType');
  const isFirstMajor = getSelectedValue('isFirstMajor');

  let finalStatus = studentStatus;

  if (semesterType === 'صيفي') {
    if (newGPA >= 2.00) {
      finalStatus = 'دراسة منتظمة';
    } else {
      finalStatus = studentStatus;
    }
  } else if (isFirstSemester) {
    if (newGPA < 2.00) {
      finalStatus = 'إنذار أول';
    } else {
      finalStatus = 'دراسة منتظمة';
    }
  } else {
    if (newGPA < 1.00) {
      finalStatus = isFirstMajor === 'no' ? 'فصل نهائي من الجامعة' : 'فصل من التخصص';
    } else if (newGPA >= 2.00) {
      finalStatus = 'دراسة منتظمة';
    } else if (studentStatus === 'دراسة منتظمة') {
      finalStatus = 'إنذار أول';
    } else if (studentStatus === 'إنذار أول') {
      finalStatus = 'إنذار نهائي';
    } else if (studentStatus === 'إنذار نهائي') {
      if (newGPA >= 1.95 && totalHours >= 99) {
        finalStatus = 'إنذار نهائي';
      } else if (newGPA < 1.95) {
        finalStatus = 'دراسة خاصة 1';
      }
    } else if (studentStatus === 'دراسة خاصة 1') {
      finalStatus = newGPA < 1.75 ? 'فصل نهائي من الجامعة' : 'دراسة خاصة 2';
    } else if (studentStatus === 'دراسة خاصة 2') {
      finalStatus = newGPA < 1.90 ? 'فصل نهائي من الجامعة' : (newGPA <= 1.99 ? 'دراسة خاصة 3' : finalStatus);
    } else if (studentStatus === 'دراسة خاصة 3' && newGPA < 2.00) {
      finalStatus = 'فصل نهائي من الجامعة';
    }
  }

  return finalStatus;
}

function displayResult(newGPA, totalHours, newCourses, previousGPA, previousHours, semesterGPA, semesterHours, finalStatus) {
  const isFirstSemester = getSelectedValue('isFirstSemester') === 'yes';
  const gpaCategory = getGPACategory(newGPA);

  const hasRepeatedCourses = newCourses.some(course => course.oldCode !== '');

  let resultHTML = `
  <h2>نتائج الحساب</h2>
  <table>
      <thead>
          <tr>
              <th>المعدل التراكمي الجديد</th>
              <th>التقدير</th>
              <th>الساعات التراكمية</th>
              <th>وضع الطالب</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td>${newGPA.toFixed(2)}</td>
              <td>${gpaCategory}</td>
              <td>${totalHours}</td>
              <td>${finalStatus}</td>
          </tr>
      </tbody>
  </table>

  <table>
      <thead>
          <tr>
              <th>اسم المادة</th>
              <th>رمز المادة</th>
              ${hasRepeatedCourses ? '<th>رمز المادة القديمة</th>' : ''}
              <th>الساعات</th>
              <th>علامة المادة</th>
          </tr>
      </thead>
      <tbody>
  `;

  newCourses.forEach(course => {
    resultHTML += `
    <tr>
        <td>${course.name}</td>
        <td>${course.code}</td>
        ${hasRepeatedCourses ? `<td>${course.oldCode || '-'}</td>` : ''}
        <td>${course.hours}</td>
        <td>${course.gradeValue.toFixed(2)}</td>
    </tr>
    `;
  });

  resultHTML += `
      </tbody>
  </table>
  `;

  if (!isFirstSemester) {
    resultHTML += `
    <table>
        <thead>
            <tr>
                <th>المعدل التراكمي القديم</th>
                <th>الساعات التراكمية القديمة</th>
                <th>المعدل الفصلي</th>
                <th>الساعات الفصلية</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${previousGPA.toFixed(2)}</td>
                <td>${previousHours}</td>
                <td>${semesterGPA.toFixed(2)}</td>
                <td>${semesterHours}</td>
            </tr>
        </tbody>
    </table>
    `;
  }

  resultSection.innerHTML = resultHTML;
  resultSection.classList.remove('hidden');

  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

function getGPACategory(gpa) {
  if (gpa >= 3.65 && gpa <= 4.00) return 'ممتاز';
  if (gpa >= 3.00 && gpa <= 3.64) return 'جيد جداً';
  if (gpa >= 2.50 && gpa <= 2.99) return 'جيد';
  if (gpa >= 2.00 && gpa <= 2.49) return 'مقبول';
  if (gpa >= 0.50 && gpa <= 1.99) return 'ضعيف';
}

function resetForm() {
  const isFirstSemesterButton = document.querySelector('#isFirstSemester .option-button[data-value="yes"]');
  isFirstSemesterButton.click();
  previousDataSection.classList.add('hidden');
  document.getElementById('previousGPA').value = '';
  document.getElementById('previousHours').value = '';

  const courseCountButton = document.querySelector('#courseCount .option-button[data-value="4"]');
  courseCountButton.click();

  resultSection.classList.add('hidden');
  resetButton.classList.add('hidden');
}

function enableCourseNameEditing() {
  const courseNames = document.querySelectorAll('.course-name');

  courseNames.forEach(courseName => {
    courseName.addEventListener('click', () => {
      const courseNameInput = courseName.nextElementSibling;
      courseName.classList.add('hidden');
      courseNameInput.classList.remove('hidden');
      courseNameInput.focus();

      courseNameInput.addEventListener('blur', () => {
        if (courseNameInput.value.trim() !== '') {
          courseName.textContent = courseNameInput.value;
        }
        courseName.classList.remove('hidden');
        courseNameInput.classList.add('hidden');
      });

      courseNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          if (courseNameInput.value.trim() !== '') {
            courseName.textContent = courseNameInput.value;
          }
          courseName.classList.remove('hidden');
          courseNameInput.classList.add('hidden');
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeButtonGroups();
  updateCoursesUI();
  loadSavedResults();

  calculateButton.addEventListener('click', calculateGPA);
  resetButton.addEventListener('click', resetForm);
});
