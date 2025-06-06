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

let courseChangeCounter = 0;

function initializeButtonGroups() {
  const buttonGroups = document.querySelectorAll('.button-group');

  buttonGroups.forEach(group => {
    const buttons = group.querySelectorAll('.option-button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

        if (group.id === 'courseCount') {
          courseChangeCounter++;
          if (courseChangeCounter >= 4) {
            courseChangeCounter = 0;
            location.reload();
          }
          updateCoursesUI();
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
  coursesContainer.innerHTML = '';
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
        <button class="option-button selected" data-value="أ">أ</button>
        <button class="option-button" data-value="أ-">أ-</button>
        <button class="option-button" data-value="ب+">ب+</button>
        <button class="option-button" data-value="ب">ب</button>
        <button class="option-button" data-value="ب-">ب-</button>
        <button class="option-button" data-value="ج+">ج+</button>
        <button class="option-button" data-value="ج">ج</button>
        <button class="option-button" data-value="ج-">ج-</button>
        <button class="option-button" data-value="د+">د+</button>
        <button class="option-button" data-value="د">د</button>
        <button class="option-button" data-value="د-">د-</button>
        <button class="option-button" data-value="هـ">هـ</button>
      </div>

      <label><i class="fas fa-clock"></i> عدد الساعات</label>
      <div class="button-group course-hours" id="course-hours-${i}">
        <button class="option-button" data-value="1">1</button>
        <button class="option-button" data-value="2">2</button>
        <button class="option-button selected" data-value="3">3</button>
        <button class="option-button" data-value="4">4</button>
        <button class="option-button" data-value="5">5</button>
        <button class="option-button" data-value="6">6</button>
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
            <button class="option-button" data-value="ج+">ج+</button>
            <button class="option-button" data-value="ج">ج</button>
            <button class="option-button" data-value="ج-">ج-</button>
            <button class="option-button" data-value="د+">د+</button>
            <button class="option-button" data-value="د">د</button>
            <button class="option-button" data-value="د-">د-</button>
            <button class="option-button" data-value="هـ">هـ</button>
          </div>
        </section>
      </section>
    `;
    coursesContainer.appendChild(coursesection);

    const repeatedsection = coursesection.querySelector('.repeated-course');
    const repeatedGroup = coursesection.querySelector('.course-repeated');
    const oldCoursesection = coursesection.querySelector('.old-course');

    repeatedGroup.addEventListener('click', () => {
      if (getSelectedValue(repeatedGroup.id) === 'yes') {
        oldCoursesection.classList.remove('hidden');
      } else {
        oldCoursesection.classList.add('hidden');
      }
    });

    courses.push({
      name: coursesection.querySelector('.course-name'),
      code: coursesection.querySelector('.course-code'),
      hours: coursesection.querySelector('.course-hours'),
      repeated: repeatedGroup,
      oldCode: coursesection.querySelector('.old-course-code')
    });
  }

  initializeButtonGroups();
  toggleRepeatedOptions();
  enableCourseNameEditing();
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

  if (isFirstSemester) {
    previousGPA = 0;
    previousHours = 0;
  } else {
    if (isNaN(previousGPA) || previousGPA < 0.5 || previousGPA > 4 || !/^\d+(\.\d{1,2})?$/.test(previousGPA)) {
      showError('يرجى إدخال معدل تراكمي صحيح', 'previousGPA');
      return;
    }

    if (isNaN(previousHours) || previousHours <= 0 || !Number.isInteger(previousHours)) {
      showError('يرجى إدخال عدد ساعات صحيح', 'previousHours');
      return;
    }
  }

  let totalPoints = previousGPA * previousHours;
  let totalHours = previousHours;
  let semesterPoints = 0;
  let semesterHours = 0;

  const newCourses = [];

  for (const course of courses) {
    const hours = parseInt(getSelectedValue(course.hours.id));
    const grade = getSelectedValue(course.code.id);
    const repeated = getSelectedValue(course.repeated.id) === 'yes';
    const oldCode = getSelectedValue(course.oldCode.id);
    const courseName = course.name.textContent;

    if (isNaN(hours) || hours <= 0) {
      showError('يرجى إدخال عدد ساعات صحيح لكل مادة', course.hours.id);
      return;
    }

    const gradeValue = gradePoints[grade];
    if (gradeValue === undefined) {
      showError('يرجى إدخال رمز مادة صحيح', course.code.id);
      return;
    }

    if (repeated) {
      const oldGradeValue = gradePoints[oldCode];
      if (oldGradeValue === undefined) {
        showError('يرجى إدخال رمز مادة قديمة صحيح', course.oldCode.id);
        return;
      }

      if (hours > previousHours) {
        showError('يرجى التأكد من ساعات المادة المعادة', course.hours.id);
        return;
      }

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
      name: courseName,
      code: grade,
      hours: hours,
      gradeValue: gradeValue,
      oldCode: repeated ? oldCode : ''
    });
  }

  const newGPA = totalPoints / totalHours;
  const semesterGPA = semesterPoints / semesterHours;

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

  displayResult(newGPA, totalHours, newCourses, previousGPA, previousHours, semesterGPA, semesterHours, finalStatus);

  setTimeout(() => {
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
  resetButton.classList.remove('hidden');
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
        <th>الساعات التراكمية الجديدة </th>
        <th>وضع الطالب</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="gpa-value">${newGPA.toFixed(2)}</span></td>
        <td><span class="category">${gpaCategory}</span></td>
        <td>${totalHours}</td>
        <td><span class="category">${finalStatus}</span></td>
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
      <td><span class="grade-symbol">${course.code}</span></td>
      ${hasRepeatedCourses ? `<td><span class=\"grade-symbol\">${course.oldCode || '-'}</span></td>` : ''}
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
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${previousGPA.toFixed(2)}</td>
          <td>${previousHours}</td>
        </tr>
      </tbody>
    </table>
  `;
  }

  if (!isFirstSemester) {
    resultHTML += `
    <table>
      <thead>
        <tr>
          <th>المعدل الفصلي</th>
          <th>الساعات الفصلية</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${semesterGPA.toFixed(2)}</td>
          <td>${semesterHours}</td>
        </tr>
      </tbody>
    </table>
  `;
  }

  function adjustForScreenSize() {
    const screenWidth = window.innerWidth;
    const resultSection = document.getElementById('resultSection');

    if (resultSection) {
      if (screenWidth < 600) {
        resultSection.style.fontSize = '8px';
      } else if (screenWidth < 900) {
        resultSection.style.fontSize = '10px';
      } else {
        resultSection.style.fontSize = '12px';
      }
    }
  }

  window.addEventListener('load', adjustForScreenSize);
  window.addEventListener('resize', adjustForScreenSize);

  resultSection.innerHTML = resultHTML;
  resultSection.classList.remove('hidden');
}

function getGPACategory(gpa) {
  if (gpa >= 3.65 && gpa <= 4.00) return 'ممتاز';
    if (gpa >= 3.65) return 'ممتاز';
  if (gpa >= 3.00 && gpa <= 3.64) return 'جيد جداً';
  if (gpa >= 2.50 && gpa <= 2.99) return 'جيد';
  if (gpa >= 2.00 && gpa <= 2.49) return 'مقبول';
  if (gpa >= 0.50 && gpa <= 1.99) return 'ضعيف'
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

  calculateButton.addEventListener('click', calculateGPA);
  resetButton.addEventListener('click', resetForm);
});
