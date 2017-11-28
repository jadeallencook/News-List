// cache extension elements
const titleInputElem = document.getElementById('title'),
  linkInputElem = document.getElementById('link'),
  addBtn = document.getElementById('add'),
  clearBtn = document.getElementById('clear'),
  dumpBtn = document.getElementById('dump'),
  articleType = document.getElementById('type'),
  articleCountElem = document.getElementById('articles'),
  optionBtnsElem = document.getElementById('option-btns'),
  clearConfirmElem = document.getElementById('clear-confirm')
yesClear = document.getElementById('yes-clear'),
  noClear = document.getElementById('no-clear');

// build vars
let articles = [];
chrome.storage.local.get('articles', (data) => {
  if (!data.articles) articles = [];
  else articles = data.articles;
  setArticleNum();
});

// set article text 
function setArticleNum() {
  if (articles.length === 1) articleCountElem.innerText = articles.length + ' Article';
  else articleCountElem.innerText = articles.length + ' Articles';
}

// current page info
chrome.storage.sync.get('current', (data) => {
  const current = data.current;
  titleInputElem.value = current.title;
  linkInputElem.value = current.link;
});

// add button
addBtn.addEventListener('click', () => {
  articles.push({
    title: titleInputElem.value,
    link: linkInputElem.value,
    type: articleType.value
  })
  chrome.storage.local.set({
    'articles': articles
  }, () => {
    setArticleNum();
  });
});

// clear btn
clearBtn.addEventListener('click', () => {
  optionBtnsElem.style.display = 'none';
  clearConfirmElem.style.display = 'inline-block';
});

yesClear.addEventListener('click', () => {
  chrome.storage.local.set({
    'articles': []
  }, () => {
    articles = [];
    setArticleNum();
  });
  optionBtnsElem.style.display = 'inline-block';
  clearConfirmElem.style.display = 'none';
});

noClear.addEventListener('click', () => {
  optionBtnsElem.style.display = 'inline-block';
  clearConfirmElem.style.display = 'none';
});

// dev options
chrome.storage.onChanged.addListener((data) => {
  console.log(data);
});