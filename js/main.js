'use strict'

const API_KEY = '29bb47b7552ec502eb87cebfbc77f766';
const API_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

$(document).ready(function() {
  
  // events
  $('.search__btn').click(() => {
    getMovie()
  })

  $('.search__field').keypress((e) => {
    if(e.keyCode === 13)
      getMovie()
  })

  $('.reviews__close').click(()=>{
    removeReviews()
  })

  $('.window').mouseup(function (e){ // событие клика по веб-документу
		let div = $('.reviews'); // тут указываем ID элемента
		if (!div.is(e.target) // если клик был не по нашему блоку
		    && div.has(e.target).length === 0) { // и не по его дочерним элементам
			removeReviews() // скрываем его
		}
	});

  
  // Functions
  async function getMovie() {
    let query = $('.search__field').val()

    $('body').addClass('loading')
    
    if (query !== '') {
      $('.movie').remove()
      let url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`
      try {
        let response = await fetch(url)
        let res = await response.json()
        console.log(res)

        if (res.results.length === 0) {
          alert('No movies found')
        } else {
          res.results.forEach((movie) => {
            if (movie.poster_path !== null)
              $('.movies').append(drawMovie(movie))
              let $movieBox = $('.movies').find(`.${movie.id}`)
              $movieBox.click(()=>getReviews(movie))
          })
        }
        $('body').removeClass('loading')    
      } catch (err) {
        alert('error!')
      }
    }
  }

  function drawMovie(movie) {
    let movieDOM = `<div class="movie ${movie.id}">
                      <img class="roll" src="images/roll.png">
                      <img class="poster" src="${IMG_URL + movie.poster_path}" alt="">
                      <h2 class="movie__title">${movie.title}</h2>
                      <div class="movie__info">${movie.title}
                        <h3><b>Release date: </b>${movie.release_date}</h3>
                        <h3><b>Rating: </b>${movie.vote_average}</h3>
                        <p>${movie.overview}</p>
                      </div>
                    </div>`
    return movieDOM
  }

  async function getReviews(movie) {
    console.log(movie.id)

    let url = `${API_URL}/movie/${movie.id}/reviews?api_key=${API_KEY}`;
    try {
      let response = await fetch(url);
      let res = await response.json();
      drawReviews(res.results, movie.title)
      console.log(res)
    } catch (err) {
      alert('error!')
    }

  }


  function drawReviews(movie, title) {
    $('.window').addClass('hide-off')
    if (movie.length == 0) {
      $('.reviews__title').text(`Not found review`);
      $('.reviews__author').text(``);
      $('.reviews__article').text(``);
    }
    else { 
    $('.reviews__title').text(title);
    $('.reviews__info').text(``);
    movie.forEach(reviews => {
        $('.reviews__info').append(`
        <span class="reviews__author">${reviews.author}</span>
				<p class="reviews__article">${reviews.content}</p>`)
      })
  }
}

  function removeReviews() {
    $('.window').removeClass('hide-off')
  }

})
