import { joinRoom } from 'https://esm.sh/gh/evbogue/bogbookv4@02f96a104e/lib/trystero-torrent.min.js'
import { h } from 'https://esm.sh/gh/evbogue/bogbookv4@02f96a104e/lib/h.js'
import { bogbot } from 'https://esm.sh/gh/evbogue/bogbookv4@02f96a104e/bogbot.js'
import { markdown } from 'https://esm.sh/gh/evbogue/bogbookv4@02f96a104e/markdown.js'
import { parseYaml } from 'https://esm.sh/gh/evbogue/wiredove@11d1eea293/yaml.js'
import { human } from 'https://esm.sh/gh/evbogue/wiredove@11d1eea293/lib/human.js'

export const embed = (hash, div) => {

  if (hash.length === 44) {
    const room = joinRoom({appId: 'bogsite', password: 'password'}, hash)

    const [ sendHash, onHash ] = room.makeAction('hash')
    const [ sendBlob, onBlob ] = room.makeAction('blob')

    room.onPeerJoin(peer => {
      sendHash(hash, peer)
    })

    onBlob(async (blob, id) => {
      console.log(blob)
      try {
        const opened = await bogbot.open(blob)
        if (opened.author === hash) {
          sendHash(opened.data)
          if (opened.author === hash && !div.childNodes[0]) {
            const img = h('img', {id: 'image', style: "width: 75px; height: 75px; object-fit: cover; float: left; margin-right: .5em;"})
            const d = h('div', [
              h('a', {style: 'float: right;', href: 'https://wiredove.net/#' + opened.hash}, [human(new Date(opened.timestamp))]),
              h('a', {href: 'https://wiredove.net/#' + opened.author}, [
                img,
                ' ',
                h('span', {id: 'name'}),
              ]),
              h('span', {id: 'content'}),
              h('div', {style: 'float: right;'}, [
                h('a', {href: 'https://wiredove.net/#' + opened.author}, ['More on Wiredove →'])    
              ])
            ])
            div.appendChild(d)
          }
        }
      } catch (err) {}
    try {
      const blobhash = await bogbot.make(blob)
      try { 
        const y = await parseYaml(blob)
        console.log(y)
        if (y.body && y.name && y.image) {
          const getBody = document.getElementById('content')
          getBody.innerHTML = await markdown(y.body)
          const getName = document.getElementById('name')
          getName.textContent = y.name
          const getImage = document.getElementById('image')
          image.id = y.image
          sendHash(y.image)
        }
      } catch (err) { }
      try { 
        const get = document.getElementById(blobhash) 
        get.src = blob
      } catch (err) {}
    } catch (err) {}
    })
  }
}
