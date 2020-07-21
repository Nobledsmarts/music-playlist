let a = new App(cont);
document.getElementById('upload-btn').addEventListener('click', function(){
    let cont = document.getElementsByClassName('upload-cont')[0];
    if(cont.classList.contains('from-top')){
      cont.classList.remove('from-top');
      return;
    }
    cont.classList.add('from-top');
})
a.display_playlist(cont);
function file(e) {
  document.getElementById('upload-btn').click();
    let len = e.files.length;
    progressMsg.textContent = "Progress :";
    progressTotal.textContent = len;
    currentProgress.textContent = 1;
    progress.style.display = "initial";
    progressMsg.style.display = "initial";
    seperator.style.display = 'initial';
    progressTotal.style.display = "initial";
    let i = 1;
    let c = Object.entries(e.files);
    for(let [key, value] of c){
      let n = i === len;
      a.upload(value, n);
      i++;
    }
    //a.display_playlist(cont);
}
