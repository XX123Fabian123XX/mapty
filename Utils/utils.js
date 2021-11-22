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
 ["crossClass", ".cross"],
 ["workoutClass", ".workout"]
])


export const workoutHtmlString = (workout) => {
  let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <div class="cross">
    <span class="cross__bar cross__bar--1"></span>
    <span class="cross__bar cross__bar--2"></span>
    </div>
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
    <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
    <span class="workout__value">${workout.distance}</span>
    <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${workout.duration}</span>
    <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.speed}</span>
    <span class="workout__unit">km/h</span>
    </div> `

  if (workout.type === "cycling") {
    html+=
    `<div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${workout.elevationGain}</span>
    <span class="workout__unit">m</span>
    </div>
    </li> `
  } else {
    html +=
    `
    <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>
    </div>
    `
  }
  return html;
}


export const getLocation = () => {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((success) => {
          const {latitude, longitude} = success.coords;
          resolve({latitude, longitude})
      }, error => {
          reject(error)
      })
  })
}
