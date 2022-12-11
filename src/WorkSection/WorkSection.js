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

// const projectsContainer = document.querySelector('#projects-container');
// projectsArray.forEach((project, index) => {
//   console.log(index);

//   console.log(project.description);
//   const newProject = document.createElement('div');
//   newProject.classList.add('project');
//   newProject.classList.add(`project-${project.index}`);
//   if (index === 0) {
//     newProject.classList.add(`active-project`);
//   }
//   const projectImg = document.createElement('img');
//   projectImg.classList.add('project-preview-img');
//   projectImg.src = project.image;

//   const imgContainer = document.createElement('div');
//   imgContainer.classList.add('img-container');

//   const projectName = document.createElement('h3');
//   projectName.textContent = project.name;

//   const tagsContainer = document.createElement('div');
//   tagsContainer.classList.add('tech-tags');

//   project.tags.forEach((tag) => {
//     const newTag = document.createElement('span');
//     newTag.classList.add(`${tag.class}`);
//     newTag.classList.add(`tag`);
//     newTag.textContent = tag.tag;
//     tagsContainer.appendChild(newTag);
//   });

//   const projectDescription = document.createElement('p');
//   projectDescription.textContent = project.description;

//   const buttonsRow = document.createElement('div');
//   buttonsRow.classList.add('buttons-row');

//   const siteButton = document.createElement('button');
//   const siteLink = document.createElement('a');
//   siteLink.target = '_blank';
//   siteLink.textContent = 'Live Site';
//   siteLink.href = project.siteLink;

//   const codeButton = document.createElement('button');
//   const codeLink = document.createElement('a');
//   codeLink.target = '_blank';
//   codeLink.textContent = '</>';
//   codeLink.href = project.codeLink;

//   siteButton.classList.add('btn');
//   siteButton.classList.add('primary-btn');

//   codeButton.classList.add('btn');
//   codeButton.classList.add('primary-btn');
//   codeButton.classList.add('code-btn');

//   siteButton.appendChild(siteLink);
//   codeButton.appendChild(codeLink);

//   buttonsRow.appendChild(siteButton);
//   buttonsRow.appendChild(codeButton);

//   imgContainer.appendChild(projectImg);

//   newProject.appendChild(imgContainer);
//   newProject.appendChild(projectName);
//   newProject.appendChild(tagsContainer);
//   newProject.appendChild(projectDescription);
//   newProject.appendChild(buttonsRow);

//   projectsContainer.appendChild(newProject);
// });
