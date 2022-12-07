const navTabs = document.querySelectorAll('li');
const projectTabContent = document.querySelectorAll('.project');

navTabs.forEach((tab) => {
  tab.addEventListener('click', (e) => {
    const target = document.querySelector(tab.dataset.target);
    navTabs.forEach((tab) => {
      tab.classList.remove('active');
    });
    projectTabContent.forEach((tabContent) => {
      tabContent.classList.remove('active-project');
    });
    target.classList.add('active-project');
    tab.classList.add('active');
  });
});
