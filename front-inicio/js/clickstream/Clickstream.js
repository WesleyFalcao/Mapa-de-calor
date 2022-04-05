const normalizeFPS = callback => {
      let ticking = true;
      const update = () => {
            if (ticking) requestAnimationFrame(update);
            ticking = true;
      };
      I
      return event => {
            if (ticking) {
                  callback(event);
                  update();
            }
            ticking = false;
      }
}

const trackClickstream = () => {
      const data = []

      const pushEventData = ({ pageX, pageY, type }) => {
            console.log(type)
            data.push({
                  time: Date.now(),
                  x: pageX,
                  y: pageY,
                  type
            })
      }

      document.addEventListener("mousemove", pushEventData)
      document.addEventListener("click", pushEventData)

      return data
}

const paintLive = (data, max = 5) => {
      const heatmap = h337.create({
            container: document.documentElement,
      })
      const update = () => {
            heatmap.setData({
                  max,
                  data,
            })
      }
      setInterval(() => {
            update(data);
      }, 10);
}

const paintHeatmap = (data, max) => {
      const heatmap = h337.create({
            container: document.documentElement
      })
      heatmap.setData({
            data, 
            max
      })
}

const paintMouse = (data) => {
      const creatMouseElement = () => {
            const mouse = document.createElement("div");
            mouse.style.cssText = `
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            top: 0px;
            left: 0px;
            transition: 0.1s;
            border: 2px solid rgba(0,0,0,.5);
            background: hsl(${360 * Math.random()}, 100%, 65%);
            `;
            document.body.appendChild(mouse)
            return mouse
      }
      const onMove = (x, y, mouse) => {
            mouse.style.transform = `translate(${x}px, ${y}px)`
      }
      const onClick = (mouse) => {
            mouse.style.boxShadow = " 0 0 0 10px black"
            setTimeout(() => {
                  mouse.style.boxShadow = ""
            }, 100);
      }

      const mouse = creatMouseElement();
      if (data.length) {
            const start = data[0].time
            data.forEach(item => {
                  setTimeout(() => {
                        if (item.type === 'mousemove') onMove(item.x, item.y, mouse)
                        if (item.type === 'mousemove') onClick(mouse)

                  }, item.time - start);
            })
      }
}

const postData = (url, data) => {
      const name = Date.now();
      fetch(`${url}/?name=${name}`, {
            method: "POST",
            headers: {
                  "Content-Type": "aplication/json"
            },
            body: JSON.stringify(data)
      })
}

const getData = async (url, total) => {
      const dataResponse = await fetch(url + "/")
      const dataJson = await dataResponse.json()
      const eachResponse = await Promise.all(
            dataJson.slice(Math.max(dataJson.length - total, 0)).map(name => fetch(`${url}/${name}`))

      );
      const eachJson = await Promise.all(eachResponse.map(item => item.json()))
      eachJson.forEach(data => paintMouse(data))
      console.log(eachJson)
      paintHeatmap(eachJson.flat(), 15)
}

getData("http://localhost:3001/api")

const data = trackClickstream()
window.onbeforeunload = () => postData("http://localhost:3001/api/", data)


