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
					dumpBtnHTML = '<div class="G-Ni J-J5-Ji"><div class="T-I T-I-ax7" id="dump-btn">Daily</div></div>';
					document.querySelector('.G-tF').innerHTML += dumpBtnHTML;
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
							let output = {},
								types = [];
							chrome.storage.local.get('articles', (data) => {
								// get content for each section
								for (let article of data.articles) {
									// generate html for output
									if (!output[article.type]) output[article.type] = '';
									output[article.type] += article.title + '<br>';
									output[article.type] += '<a href="' + article.link + '" target="_blank">' + article.link + '</a><br><br>';
								}
								// add section title/icon
								let emailHTML = '';
								for (let type of ['general', 'politics', 'industry', 'beehive', 'deep', 'family', 'faith', 'pop', 'sports', 'money', 'tech']) {
									if (output[type]) {
										if (type === 'general') {
											emailHTML += '<font color="#ff0000" size="4"><b>GENERAL NEWS&nbsp;<img goomoji="1f4f0" data-goomoji="1f4f0" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f4f0" class="CToWUd"></b></font><br><br>';
										} else if (type === 'politics') {
											emailHTML += '<font color="#666666" size="4"><b>POLITICS&nbsp;<img goomoji="fe4e6" data-goomoji="fe4e6" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/fe4e6" class="CToWUd"></b></font><br><br>';
										} else if (type === 'industry') {
											emailHTML += '<font color="#660000" size="4"><b>IN THE INDUSTRY&nbsp;<img goomoji="1f5de" data-goomoji="1f5de" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f5de" class="CToWUd"></b></font><br><br>';
										} else if (type === 'beehive') {
											emailHTML += '<font color="#3d85c6" size="4"><b>BEEHIVE STATE&nbsp;<img goomoji="1f41d" data-goomoji="1f41d" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f41d" class="CToWUd"></b></font><br><br>';
										} else if (type === 'deep') {
											emailHTML += '<font color="#38761d" size="4"><b>DEEP DIVES&nbsp;<img goomoji="1f4dd" data-goomoji="1f4dd" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f4dd" class="CToWUd"></b></font><br><br>';
										} else if (type === 'family') {
											emailHTML += '<font color="#9900ff" size="4"><b>FAMILY AND HEALTH&nbsp;<img goomoji="1f34e" data-goomoji="1f34e" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f34e" class="CToWUd"></b></font><br><br>';
										} else if (type === 'faith') {
											emailHTML += '<font color="#073763" size="4"><b>FAITH&nbsp;<img goomoji="1f64f" data-goomoji="1f64f" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f64f" class="CToWUd"></b></font><br><br>';
										} else if (type === 'pop') {
											emailHTML += '<font color="#e06666" size="4"><b>POP CULTURE&nbsp;<img goomoji="1f4fa" data-goomoji="1f4fa" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f4fa" class="CToWUd"></b></font><br><br>';
										} else if (type === 'money') {
											emailHTML += '<font color="#274e13" size="4"><b>MONEY&nbsp;<img goomoji="1f4b0" data-goomoji="1f4b0" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f4b0" class="CToWUd"></b></font><br><br>';
										} else if (type === 'sports') {
											emailHTML += '<font color="#ff9900" size="4"><b>SPORTS&nbsp;<img goomoji="26bd" data-goomoji="26bd" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/26bd" class="CToWUd"></b></font><br><br>';
										} else if (type === 'tech') {
											emailHTML += '<font color="#000000" size="4"><b>TECH&nbsp;<img goomoji="1f4f1" data-goomoji="1f4f1" style="margin:0 0.2ex;vertical-align:middle;max-height:24px" src="https://mail.google.com/mail/e/1f4f1" class="CToWUd"></b></font><br><br>';
										}
										// add section content
										emailHTML += output[type];
									}
								}
								let emailSignatureHTML = document.querySelector('.editable').innerHTML;
								document.querySelector('.editable').innerHTML = emailHTML + emailSignatureHTML;
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
				});
			}
		}
	}, 10);
});