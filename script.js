async function getRandomWords(filePath, count = 20) {
    try {
        const response = await fetch(filePath);
        const text = await response.text();
        const words = text.trim().split('\n');

        // Shuffle and take first 20
        const shuffled = words.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

function displayWords(arrayOfWords) {
    const wordsToShow = arrayOfWords.join(' ');

    const charactersToShow = wordsToShow.split('');

    const wordsContainer = document.querySelector('.words');
    wordsContainer.innerHTML = '';

    charactersToShow.forEach((character) => {
        const characterSpan = document.createElement('span');
        characterSpan.className = 'letter';
        characterSpan.innerText = character;
        document.querySelector('.words').appendChild(characterSpan);
    });
}

document.querySelector('.game').addEventListener('blur', () => {
    document.querySelector('.offFocusMessage').style.opacity = '1';
    document.querySelector('.game').style.filter = 'blur(5px)';
});

document.querySelector('.game').addEventListener('focus', () => {
    document.querySelector('.offFocusMessage').style.opacity = '0';
    document.querySelector('.game').style.filter = 'blur(0)';
});

document.querySelector('.offFocusMessage').addEventListener('click', () => {
    document.querySelector('.game').focus();
});

function moveCursor(isBackspace, currentLetter) {
    if (isBackspace && currentLetter.previousSibling) {
        if (currentLetter.previousSibling.nodeType !== 3) {
            cursor.style.left =
                currentLetter.previousSibling.getBoundingClientRect().left +
                'px';
            cursor.style.top =
                currentLetter.previousSibling.getBoundingClientRect().top +
                'px';
        }
    } else {
        cursor.style.left = currentLetter.nextSibling
            ? currentLetter.nextSibling.getBoundingClientRect().left + 'px'
            : currentLetter.getBoundingClientRect().right + 'px';

        cursor.style.top = currentLetter.nextSibling
            ? currentLetter.nextSibling.getBoundingClientRect().top + 'px'
            : currentLetter.getBoundingClientRect().top + 'px';
    }
}

function moveCurrent(isBackspace, currentLetter) {
    if (isBackspace && currentLetter.previousSibling) {
        if (currentLetter.previousSibling.nodeType !== 3) {
            currentLetter.previousSibling.classList.add('current');
        }
    } else {
        if (currentLetter.nextSibling) {
            currentLetter.classList.remove('current');
            currentLetter.nextSibling.classList.add('current');
        }
    }
}

function manageCorrectOrIncorrectStyle(key, isBackspace, currentLetter) {
    if (isBackspace && currentLetter.previousSibling) {
        if (currentLetter.previousSibling.nodeType !== 3) {
            currentLetter.previousSibling.classList.remove('correct');
            currentLetter.previousSibling.classList.remove('incorrect');
        }
    } else {
        if (key === currentLetter.textContent) {
            currentLetter.classList.add('correct');
        } else {
            currentLetter.classList.add('incorrect');
        }
    }
}

document.querySelector('.game').addEventListener('keyup', (event) => {
    const key = event.key;
    const isBackspace = key === 'Backspace';
    const currentLetter = document.querySelector('.current');

    moveCursor(isBackspace, currentLetter);
    moveCurrent(isBackspace, currentLetter);

    manageCorrectOrIncorrectStyle(key, isBackspace, currentLetter);

    if (!currentLetter.nextSibling) {
        if (document.querySelectorAll('.incorrect').length > 0) {
            alert('you have missing!');
        } else {
            alert('finish');
            resetGame();
        }
    }
});

async function resetGame() {
    const randomWords = await getRandomWords('words.txt', 20);
    displayWords(randomWords);

    document.querySelector('.letter').classList.add('current');
    document.querySelector('#cursor').style.left = '20px';
}
resetGame();
