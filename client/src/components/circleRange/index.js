
export class СircleRange{
  _rangeValue = 0
  _indicatorValue = 0
  _side = 0
  _move = false
  _maxI = 100
  _minI = 0
  _maxR = 100
  _minR = 0
  _typeRange = "circle"
  _range = false
  _indicator = true

  constructor(container,options={}) {
    this._$container = container
    let type = options.type || "indicator"
    this._range = (type === 'range' || type === 'all')
    this._indicator = (type === 'indicator' || type === 'all')
    this._maxI = options.max || 100
    this._minI = options.min || 0
    this._maxR = options.maxRange || 100
    this._minR = options.minRange || 0
    this._typeRange = options.typeRange || "circle"
    if(this._$container.clientWidth/2<this._$container.clientHeight)
      this._side = this._$container.clientWidth
    else
      this._side = this._$container.clientHeight*2
    this.radius = options.r || this._side/2 - 20
    this.y = options.y || this._$container.clientHeight/2 + this.radius/2
    this.x = options.x || "50%"
    this.strokeDasharray = this.strokeDashoffset = this.radius*Math.PI
    this._$element = document.createElement('div')
    this._$element.className = "circle-indicator"

    this._init()
  }

  _init(){
    let c = document.createElement('div')
    c.innerHTML = `<svg>
                  <circle class="circleRange-base" cx="${this.x}" cy="${this.y}" r="${this.radius}"></circle>
                  ${(this._indicator)?`<circle class="circleRange-indicator" cx="${this.x}" cy="${this.y}" r="${this.radius}"></circle>`:null}
                  ${(this._range)?`<circle class="circleRange-range" cx="${this.x}" cy="${this.y}" r="${this.radius}"></circle>`:null}
                </svg>`
    this._$svg = c.firstChild
    this._$element.append(this._$svg)

    this._$container.append(this._$element)

    let backCircle = this._$svg.querySelector('circle:first-child')
    backCircle.style.strokeDashoffset = this.strokeDashoffset
    backCircle.style.strokeDasharray = this.strokeDasharray
    // backCircle.style.strokeWidth = this.strokeWidth

    if(this._indicator){
      let indicator = this._$svg.querySelector('circle:nth-child(2)')
      indicator.style.strokeDashoffset = this.strokeDashoffset
      indicator.style.strokeDasharray = `${0}, ${this.radius*2*Math.PI}`
      // indicator.style.strokeWidth = this.strokeWidth

      this._$textIndicatorValue = document.createElement('p')
      this._$textIndicatorValue.className = "circleRange-indicator-value"
      this._$textIndicatorValue.textContent = 0
      this._$element.append(this._$textIndicatorValue)
    }

    if(this._range){
      let range = this._$svg.querySelector('circle:last-child')
      range.style.strokeDashoffset = this.strokeDashoffset
      range.style.strokeDasharray = `${0}, ${this.radius*2*Math.PI}`
      // range.style.strokeWidth = this.strokeWidth

      this._$textRangeValue = document.createElement('p')
      this._$textRangeValue.className = "circleRange-range-value"
      this._$textRangeValue.textContent = 0
      this._$element.append(this._$textRangeValue)

      this._rangeInit()
    }
  }

  _rangeInit(){
    up(this)

    let backCircle = this._$svg.querySelector('circle:first-child')
    let indicator = this._$svg.querySelector('circle:nth-child(2)')
    let range = this._$svg.querySelector('circle:last-child')

    backCircle.onmousedown = ()=>mdown(this)
    range.onmousedown = ()=>mdown(this)
    indicator.onmousedown = ()=>mdown(this)
    this._$container.onmouseleave = ()=>up(this)
    this._$svg.onmouseup = ()=>up(this)
    this._$container.onmousemove = (event)=>move(event,this)

    function mdown(t) {
      t._move = true
    }

    function up(t) {
      t._move = false
    }

    function move(e,t) {
      if(t._move){
        let circle = t._$svg.querySelector('circle:first-child')
        let center_x = (circle.r.baseVal.value) + circle.getBoundingClientRect().left
        let center_y = (circle.r.baseVal.value) + circle.getBoundingClientRect().top
        let pos_x = e.pageX
        let pos_y = e.pageY
        let delta_y =  center_y - pos_y
        let delta_x = center_x - pos_x
        let angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI)
        if(angle < 0)
          angle = 360 + angle
        angle = Math.round(angle)
        if(angle>180&&angle<270)
          angle = 180
        if(angle<=0||angle>=270)
          angle=0
        let oldRange = (180 - 0)
        let newRange = (t._maxR - t._minR)
        let newValue = (((angle - 0) * newRange) / oldRange) + t._minR
        if(t.valueRange !== Math.round(newValue)){
          t.valueRange = Math.round(newValue)
          if(typeof(t.onchange) === "function"){
            t.onchange(t)
          }
        }
      }
    }
  }

  set valueIndicator(num){
    if(typeof(num)!=="number" || !this._indicator)return
    this._$textIndicatorValue.textContent = num
    if(num<this._minI)
      num = this._minI
    if(num>this._maxI)
      num = this._maxI
    let indicator = this._$svg.querySelector('circle:nth-child(2)')
    this._indicatorValue = num
    let v = ((this.radius*Math.PI)*(num-this._minI))/(this._maxI-this._minI)
    indicator.style.strokeDasharray = `${v}, ${this.radius*2*Math.PI-v}`
  }

  get valueIndicator(){
    return this._indicatorValue
  }

  set valueRange(num){
    if(typeof(num)!== "number" || !this._range)return
    this._rangeValue = num;
    let range = this._$svg.querySelector('circle:last-child')
    let v = ((this.radius*Math.PI)*(num-this._minR))/(this._maxR-this._minR)
    this._$textRangeValue.textContent = num
    if(this._typeRange === "circle")
      range.style.strokeDashoffset = this.radius*Math.PI-v
    if(this._typeRange === "line")
      range.style.strokeDasharray = `${v}, ${this.radius*2*Math.PI-v}`
  }

  get valueRange(){
    return this._rangeValue
  }

  setColor(color){
    if(!this._indicator)return
    let indicator = this._$svg.querySelector('circle:nth-child(2)')
    indicator.style.stroke=color
  }
  setColorRange(color){
    if(!this._range)return
    let range = this._$svg.querySelector('circle:last-child')
    range.style.stroke=color
  }
}
