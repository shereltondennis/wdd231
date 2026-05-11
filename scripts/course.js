const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    completed: true
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    completed: true
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    completed: true
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    completed: false
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    completed: true
  },
  {
    subject: "WDD",
    number: 231,
    title: "Web Frontend Development I",
    credits: 2,
    completed: false
  }
];

const cardsContainer = document.querySelector("#courseCards");
const creditsTotal = document.querySelector("#creditsTotal");
const allBtn = document.querySelector("#allBtn");
const wddBtn = document.querySelector("#wddBtn");
const cseBtn = document.querySelector("#cseBtn");

const filterButtons = [allBtn, wddBtn, cseBtn].filter(Boolean);

function setActiveButton(activeButton) {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });
}

function displayCourses(courseList) {
  if (!cardsContainer || !creditsTotal) {
    return;
  }

  cardsContainer.innerHTML = "";

  courseList.forEach((course) => {
    const card = document.createElement("article");
    card.className = `course-card${course.completed ? " completed" : ""}`;

    const code = document.createElement("p");
    code.className = "course-code";
    code.textContent = `${course.subject} ${course.number}`;

    const title = document.createElement("p");
    title.className = "course-title";
    title.textContent = course.title;

    const meta = document.createElement("p");
    meta.textContent = `${course.credits} credit${course.credits === 1 ? "" : "s"}`;

    card.append(code, title, meta);
    cardsContainer.appendChild(card);
  });

  const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
  creditsTotal.textContent = `Total Credits: ${totalCredits}`;
}

if (allBtn && wddBtn && cseBtn) {
  allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    displayCourses(courses);
  });

  wddBtn.addEventListener("click", () => {
    setActiveButton(wddBtn);
    displayCourses(courses.filter((course) => course.subject === "WDD"));
  });

  cseBtn.addEventListener("click", () => {
    setActiveButton(cseBtn);
    displayCourses(courses.filter((course) => course.subject === "CSE"));
  });

  setActiveButton(allBtn);
  displayCourses(courses);
}
