export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const formatDate = (date) => {
  return `${months[date.getMonth()]} ${date.getDate()}`
}

export const DOMElements = new Map([
    ["form",  document.querySelector('.form')],
     ["containerWorkouts", document.querySelector('.workouts')],
 ["inputType" ,document.querySelector('.form__input--type')],
 ["inputDistance" ,document.querySelector('.form__input--distance')],
 ["inputDuration" ,document.querySelector('.form__input--duration')],
 ["inputCadence" ,document.querySelector('.form__input--cadence')],
 ["inputElevation" ,document.querySelector('.form__input--elevation')],
 ["formRowHidden","form__row--hidden"],
 ["cross-bar","cross__bar"],
 ["cross", "cross"]
])


export const getCyclcingHTMLString = (id, date, distance, time, speed, elevationGain) => { 
    
    return `
    <li class="workout workout--cycling" data-id="cycling-${id}">
    <div class="cross">
    <span class="cross__bar cross__bar--1"></span>
    <span class="cross__bar cross__bar--2"></span>
    </div>
    <h2 class="workout__title">Cycling on ${date}</h2>
    <div class="workout__details">
    <span class="workout__icon">🚴‍♀️</span>
    <span class="workout__value">${distance}</span>
    <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${time}</span>
    <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${speed}</span>
    <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${elevationGain}</span>
    <span class="workout__unit">m</span>
    </div>
    </li> `
    }

    export const getRunningHTMLString = (id, date, distance, time, speed, cadence) => { 
      return ` <li class="workout workout--running" data-id="running-${id}">
      <div class="cross">
      <span class="cross__bar cross__bar--1"></span>
      <span class="cross__bar cross__bar--2"></span>
    </div>
      <h2 class="workout__title">Running on ${date}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${time}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${speed}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>`
      }