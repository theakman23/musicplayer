/* elementlere ulaşıp obje olarak kullanmak için */

const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const repeatButton = document.getElementById('repeat');
const shuffleButton = document.getElementById('shuffle');
const audioButton = document.getElementById('audio');
const songImage = document.getElementById('songImage');
const songName = document.getElementById('songName');
const songArtist = document.getElementById('songArtist');
const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');
const playListButton = document.getElementById('playlist');

const maxDuration = document.getElementById('maxDuration')
const currentTimeRef = document.getElementById('current-time')


const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playlistSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')


//index şarkı için

let index = 0



// döngü durumu

let loop = true

// decoding or parsing
const songsList = [
    {
        name:'suverleylam',
        link:'muzik/suver.mp4',
        artist:'ibo',
        image:'muzik/ibo.jpeg'
    },
    {
        name:'emmoğlu ',
        link:'muzik/ferdi.mp4',
        artist:'ferdi tayfur',
        image:'muzik/ferdi.jpeg'
    },
    {
        name:'uğra bana',
        link:'muzik/ugrabana.mp4',
        artist: 'hirai zerdüş',
        image:'muzik/hirai.jpeg'
    },
    {
        name:'snow',
        link:'muzik/red.mp4',
        artist:'red hot chili peppers',
        image:'muzik/red.jpeg'
    },
    {
        name:'nerdenbileceksiniz',
        link:'muzik/nereden.mp4',
        artist:'ecem erkek',
        image:'muzik/ecem.jpeg'
    },
    {
        name:'müjdelerver',
        link:'muzik/bendeniz.mp4',
        artist:'bendeniz',
        image:'muzik/bendeniz.jpeg'
    }
]

// events (olaylar) objesi

let events ={
    mouse:{
        click: 'click'
    },
    touch: {
        click: 'touchstart'
    }
}

let deviceType = ''

const isTouchDevice = () => {
    try{
        document.createEvent('TouchEvent') // create olabilir
        deviceType = 'touch'
        return true
    }catch(e){
        deviceType = 'mouse'
        return false
    }
}

// zaman formatlama

const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute // 03.00
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second // 00.03
    return `${minute}:${second}`
}



// şarkı atama
const setSong = (arrayIndex) => {
    //tüm özellikleri çıkar
    console.log(arrayIndex)
    console.log(songsList[arrayIndex])

    //let {name, link, artist, image} = songsList[arrayIndex]
    audio.src = songsList[arrayIndex].link
    songName.innerText = songsList[arrayIndex].name
    songArtist.innerHTML = songsList[arrayIndex].artist
    songImage.src = songsList[arrayIndex].image
    

    // süreyi göster metadata yüklendiğinde
    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration)
    }
    playListContainer.classList.add('hide')
    playAudio()
}

// şarkıyı oynat

const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
}

// tekrar et
repeatButton.addEventListener('click', () => {
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log('tekrar kapatıldı')
    }else{
        repeatButton.classList.add('active')
        audio.loop = true
        console.log('tekrar açık')
    }
})

const nextSong = () =>{
    //eğer normal çalıyorsa sonraki şarkıya geç
    if(loop){
        if(index == songsList.length -1){
            //sondaysak başa git
            index = 0
        }else{
            index += 1
        }

        setSong(index)
        playAudio()
    }else{
        //rastgele bir şarkı seç
        let randIndex = Math.floor(Math.random() * songsList.length)
        console.log(randIndex)
        setSong(randIndex)
        playAudio
    }
}

//şarkıyı durdurma

const pauseAudio = () =>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

// önceki şarkıya geçmek

const previousSong = () =>{
    if(index > 0){
        pauseAudio()
        index -=1
    }else{
        index = songsList.length - 1
    }
    //console.log(index) 
    setSong(index)
    playAudio()
    
}


// şarkı kendi biterse sonrakine geç
audio.onended = () =>{
    nextSong()
}


//shuffle songs

shuffleButton.addEventListener('click', ()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop = true
        console.log('karıştırma kapalı')
    }else{
        shuffleButton.classList.add('active')
        loop = false
        console.log('karıştırma açık')
    }
})

//play button
playButton.addEventListener('click', playAudio)


//next button
nextButton.addEventListener('click', nextSong)

//pause button
pauseButton.addEventListener('click', pauseAudio)

//prev button
prevButton.addEventListener('click', previousSong)

//cihaz tipini seç
isTouchDevice()
progressBar.addEventListener(events[deviceType].click,(event)=>{
    //progress barı başlatırken
    let coordStrat = progressBar.getBoundingClientRect().left

    //mouse click yapma noktası
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX
    let progress = (coordEnd - coordStrat) / progressBar.offsetWidth

    //genişliği proggrese atama
    currentProgress.style.width = progress * 100 + '%'

    // zamanı atama
    audio.currentTime = progress * audio.duration

    // oynat
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})


//progressi zamana göre ayarla
setInterval(()=>{
    //console.log('set intervall run')
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime/audio.duration.toFixed(3)) * 100 + '%'
},1000)// 1 sn  şeklinde çalışması için


// zamanı güncelleme
audio.addEventListener('timeupdate',()=>{
currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//playlist oluştur

const initializePlayList = () =>{
    for(let i in songsList){
        playlistSongs.innerHTML += `<li class="playlistsong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
              ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
              ${songsList[i].artist}  
            </span>  
        </div>
        </li>`

    }
}

//şarkı listesini göster
playListButton.addEventListener("click",()=>{
    playListContainer.classList.remove('hide')
    
})

//şarkı listesini kapat
playListButton.addEventListener("click",()=>{
    playListContainer.classList.add('hide')
})

// ekran yüklenirken
window.onload = () =>{
    //başlangıç şarkı sırası
    index = 0
    setSong(index)
    pauseAudio()
    //playlist oluştur
    initializePlayList()
}