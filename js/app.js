class App{
	constructor(cont){
		this.d = document;
		this.ad = this.d.createElement('AUDIO');
		this.i = 0;
		this.c = cont;
		
	}
play(str){
		this.ad.src = str;
		this.ad.autoplay = true;
		this.ad.play();
		return this.ad;
	}
	upload(fileObj, bool){
		let filetype = fileObj.type;
 		let ext = filetype.split('/')[1];
 		let filename = (fileObj.name);
 		let i = filename.lastIndexOf(ext);
 		let name = filename.slice(0, i - 1);
 		let filesize = fileObj.size;
		 let fileurl = window.URL.createObjectURL(fileObj);
	
		 let reader = new FileReader();
		 let dataur = [];
		 let that = this;
		 let y = {};
		 for(let g in fileObj){
			y[g] = fileObj[g];
		}

	let dataurl = "";
	reader.addEventListener('loadend', function(e){
		let jso = [reader.result];
		let ab = new Blob(jso);
		let r = ab.text();
		r.then((el) => {
			dataurl = el;
			let openRequest = indexedDB.open('store', 1);
			openRequest.onupgradeneeded = function(){
				let db = openRequest.result;
				let transaction = db.transaction('playlist', 'readwrite');
				
			};
			openRequest.onsuccess = function(){
				let db = openRequest.result;
				let transaction = db.transaction('playlist', 'readwrite');
				let playlists = transaction.objectStore('playlist');
				let music = {
					dataurl,
					filesize,
					ext,
					filetype,
					fileurl,
					name,
					filename,
					fileObj,
					obj : JSON.stringify(y),
				};
			let res = playlists.add(music);
			res.onsuccess = function(){
				let n = +(currentProgress.textContent);
				let u = ++n;
				currentProgress.textContent = u;
				// console.log(u);
				if(bool){
					currentProgress.style.display = 'none';
					progressTotal.style.display = 'none';
					seperator.style.display = 'none';
					progressMsg.textContent = "Refreshing";
					that.display_playlist(cont);
				}
			}
		}
		}).then(() => {
			// cont.innerHTML = "";
			//that.display_playlist(cont);
		});
	});
	reader.readAsDataURL(fileObj);
	}
	
	display_playlist(c){
		let that = this;
		let openRequest = indexedDB.open('store', 1);
		openRequest.onupgradeneeded = function(){
			let db = openRequest.result;
			if(!db.objectStoreNames.contains('playlist')){
				db.createObjectStore('playlist', {keyPath : 'filename', autoIncrement : true});
			}
		};
		openRequest.onsuccess = function(){
			let db = openRequest.result;
			let transaction = db.transaction('playlist', 'readwrite');
			let playlists = transaction.objectStore('playlist');
			c.innerHTML = "";
			let countP = playlists.getAllKeys();
			// console.log(countP.e.srcElement.result)
			countP.onsuccess = function(e){
				let lastKey = e.srcElement.result[e.srcElement.result.length - 1];
				let request = playlists.openCursor();
				this.i = 0;
				request.onsuccess = function (e){
					let file = (request.result);
					if(file){
					let key = file.key;
					let value = file.value;
					// console.log(file);
					that.displayFiles(value, c);
					if(lastKey == key){
						progressMsg.style.display = 'none';
					}
					that.addEvent();
					file.continue();
					} else {
						this.i = 0;
					}
				}
			}
		}
	}
	displayFiles(files, c){
		c.innerHTML+=`<li data-filename="${files.filename}" data-name="${files.name}" data-type="${files.filetype}"  data-id='${this.i}'> ${files.filename} </li>`;
		this.i++;
	}
	
	getKey(key){
		let that = this;
		let openRequest = indexedDB.open('store', 1);
		openRequest.onupgradeneeded = function(){
			let db = openRequest.result;
			if(!db.objectStoreNames.contains('playlist')){
				db.createObjectStore('playlist', {keyPath : 'filename', autoIncrement : true});
			}
		};
		openRequest.onsuccess = function(){
			let db = openRequest.result;
			let transaction = db.transaction('playlist', 'readonly');
			let playlists = transaction.objectStore('playlist');
			let request = playlists.get(key);
			request.onsuccess = function (e){
				let file = (e.srcElement.result);
				let url = file.dataurl;
				as.src = url;
				as.play().catch((err) => {
					console.log(err);
				});
			}
		}
	}
	addEvent(){
		let that = this;
		[... (cont.querySelectorAll('LI'))].forEach((e) => {
			e.addEventListener('click', () => {
				that.getKey((e.dataset.filename));
			});
		})
	}
}
    
     
    
    
    
    
    
    
    
    
    