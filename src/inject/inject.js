chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			// cache current page info
			const link = window.location.href;
			let title = '';
			// get page header text if available
			if (document.querySelector('h1')) title = document.querySelector('h1').innerText;
			// gmail module
			if (window.location.host === 'mail.google.com') {
				// main mail window
				if (window.location.search.length === 0) {
					// add dump btn to gmail
					dumpBtnHTML = '<div class="T-I J-J5-Ji T-I-KE L3" style="margin-top: 5px;" id="dump-btn">News List</div>';
					document.querySelector('.z0').innerHTML += dumpBtnHTML;
					// dump btn event listener
					document.getElementById('dump-btn').addEventListener('click', () => {
						// format date
						const currentDate = new Date();
						const month = currentDate.getMonth() + 1,
							day = currentDate.getDate(),
							year = currentDate.getFullYear();
						// create subject
						const subject = 'The Morning Links (' + month + '/' + day + '/' + year + ')';
						window.location = 'https://mail.google.com/mail/u/0/?view=cm&su=' + subject;
					});
				} else { // dumping email
					const insertBody = setInterval(() => {
						// wait for email container to show
						if (document.querySelector('.editable')) {
							clearInterval(insertBody);
							// insert email body
							let output = '';
							chrome.storage.sync.get('articles', (data) => {
								for (let article of data.articles) {
									output += article.title + '\n';
									output += article.link + '\n\n';
								}
								document.querySelector('.editable').innerText = output;
							});
						}
					}, 100);
				}
			} else {
				// cache current page to use via page_action
				chrome.storage.sync.set({
					'current': {
						'link': link,
						'title': title
					}
				}, () => {});
			}
		}
	}, 10);
});