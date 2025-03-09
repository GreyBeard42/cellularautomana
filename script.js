let currow = []
let width = Math.floor(window.innerWidth/5)
let y

function makeRule(r) {
    r = parseInt(r)
    let template = [[1,1,1], [1,1,0], [1,0,1], [1,0,0], [0,1,1], [0,1,0], [0,0,1], [0,0,0]]
    let output = []
    let bits = r.toString(2).padStart(8, "0")
    for(let i=0; i<8; i++) {
        let little = template[i]
        little.push(parseInt(bits[i]))
        output.push(little)
    }
    return output
}

let userrule = document.getElementById("userrule")
rule = makeRule(userrule.value)
userrule.addEventListener("input", () => {
    if(userrule.value > 255) userrule.value = 255
    if(userrule.value < 0) userrule.value = 0
    reset()
})

function reset() {
    rule = makeRule(userrule.value)
    y = 0
    currow = []
    for(let w=0; w<width; w++) currow.push(Math.round(Math.random()))
    document.getElementById("content").innerHTML = ""
}

function buildRow(row) {
    y++
    let output = []
    let x = 0
    let erow = document.createElement("div")
    erow.classList.add("row")
    row.forEach(() => {
        //neighbors
        let n = []
        if(x > 0) n.push(row[x-1])
        n.push(row[x])
        if(x < width-1) n.push(row[x+1])
        
        //rules
        let happy = false
        n = JSON.stringify(n)
        rule.forEach((r) => {
            if(!happy) {
                let rule = []
                if(JSON.parse(n).length === 3) {
                    rule.push(r[0])
                    rule.push(r[1])
                    rule.push(r[2])
                } else if(x===0) {
                    rule.push(r[0])
                    rule.push(r[1])
                } else if(x===width-1) {
                    rule.push(r[1])
                    rule.push(r[2])
                }
                if(n===JSON.stringify(rule)) {
                    output.push(r[3])
                    let happy = true
                }
            }
        })
            
        let cell = document.createElement('div')
        cell.classList.add("cell")
        if(output[output.length-1] === 0) cell.style.backgroundColor = "black"
        else cell.style.backgroundColor = "white"
        erow.appendChild(cell)
        
        x++
    })
    document.getElementById("content").appendChild(erow)
    setTimeout(() => {currow = buildRow(currow)}, document.getElementById("speed").value)
    document.getElementById("content").scrollTo(0, y*window.innerWidth*0.09)
    return output
}
let speed = document.getElementById("speed")
speed.addEventListener("input", () => {
    if(speed.value < 1) speed.value = 1
    if(speed.value > 100) speed.value = 200
})

reset()

let erow = document.createElement("div")
erow.classList.add("row")
currow.forEach((c) => {
    let cell = document.createElement('div')
    cell.classList.add("cell")
    if(c === 0) cell.style.backgroundColor = "black"
    else cell.style.backgroundColor = "white"
    erow.appendChild(cell)
})
document.getElementById("content").appendChild(erow)

currow = buildRow(currow)