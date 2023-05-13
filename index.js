// the TVMaze API URLs
const tvmazeAPISearch = 'https://api.tvmaze.com/search/shows?q=';
const tvmazeAPISearchByName = 'https://api.tvmaze.com/singlesearch/shows?q=';

// get the DOM elements
const findForm = document.querySelector('#find-form');
const findInput = document.querySelector('#find-input');
const findResult = document.querySelector('#find-result');
const showInfo = document.querySelector('#show-info');
const loader = document.querySelector('#loader');


// Gets the TV shows data from the API
const getDataFromApi = async url => {

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Request error: ', error);
    }
};

// Displays the shows titles and images
const displayTVShows = showsData => {

    showsData.forEach(element => {

        // check if the show has image and name
        if (element.show.image && element.show.name) {
            
            // create the image box div to store the show image and name
            const imageBox  = document.createElement('div');

            imageBox.className = 'image-box';
            // create the image, name and info button for each show element
            imageBox.innerHTML = `<h3><b>${element.show.name}</b></h3>
                                    <img src="${element.show.image.medium} alt="${element.show.name}">
                                    <button class="info-btn" data-name="${element.show.name}" 
                                    data-id="${element.show.id}">Get Info</button>
                                    `;

            //append the image box for display 
            findResult.append(imageBox);           
        }
    });
};

// Displays the show info
const displayShowInfo = show => {

    showInfo.innerHTML = `<div id="info">
                                <h3><b>${show.name}</b></h3>
                                <img src="${show.image.medium} alt="${show.name}">
                                <p>Date of Release: ${show.premiered}</p>
                                <p>Genres: ${show.genres.join(', ')}</p>
                                <p>Summary: <br>${show.summary}</p>
                                <button id="return-btn">Return</button>
                            </div>
                            `;
};

// Displays the error message
const displayError = message => {
    findResult.innerHTML = `<h3 class="error">${message}</h3>`;
};

// Creates event listener for the info buttons
const createShowInfoButtonsEvent = () => {

    const buttons = document.querySelectorAll('.info-btn');

    buttons.forEach(button => {
        button.addEventListener('click', async evt => {

            // hide the tv shows search results
            findResult.classList.add('hide');

            // get the selected show name
            const showName = evt.target.getAttribute('data-name');

            // construct the url for the selected show
            const url = `${tvmazeAPISearchByName}${showName}`;

            // show the spinner
            loader.classList.remove('hide');

            const data = await getDataFromApi(url);

            // hide the spinner
            loader.classList.add('hide');

            displayShowInfo(data);

            // create event for the return button
            createReturnButtonEvent();
        });
    });
};

// Creates event listener for the return button
const createReturnButtonEvent = () => {

    const returnBtn = document.querySelector('#return-btn');

    returnBtn.addEventListener('click', () => {

        // clear the show info
        showInfo.innerHTML = '';

        // show the tv shows search results again
        findResult.classList.remove('hide');
    });
}

// Event listener for the find form
findForm.addEventListener('submit', async evt => {

    // prevent the default form submission
    evt.preventDefault();

    // reset the values of the show info and search result
    showInfo.innerHTML = '';
    findResult.innerHTML = '';

    // show the search results div
    findResult.classList.remove('hide');

    const inputText = findInput.value.trim();

    // check if the input is empty
    if (!inputText) {
        displayError('Please, Enter TV Show Name');
        return;
    }
    
    // show the spinner
    loader.classList.remove('hide');

    const data = await getDataFromApi(`${tvmazeAPISearch}${inputText}`);

    // hide the spinner
    loader.classList.add('hide');

    //show the error message if the data is empty
    if (data === null || data.length === 0) {
        displayError('Sorry, Couldn\'t Find the TV Show');
        return;
    }

    displayTVShows(data); 

    // create event listener for the get info buttons
    createShowInfoButtonsEvent();

    // reset the input 
    findInput.value = '';
});


