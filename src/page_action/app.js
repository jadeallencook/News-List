// cache extension elements
const titleInputElem = document.getElementById('title'),
  linkInputElem = document.getElementById('link'),
  addBtn = document.getElementById('add'),
  clearBtn = document.getElementById('clear'),
  dumpBtn = document.getElementById('dump'),
  articleType = document.getElementById('type'),
  articleCountElem = document.getElementById('articles');

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
  chrome.storage.local.set({
    'articles': []
  }, () => {
    articles = [];
    setArticleNum();
  });
});

// dev options
chrome.storage.onChanged.addListener((data) => {
  console.log(data);
});