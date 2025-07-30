const numberOfWordsToType = 2;
let secondsInterval = null;
let secondsTaken = 0;
let isPaused = false;

async function getRandomWords(filePath, count = 20) {
    try {
        const response = await fetch(filePath);
        const text = await response.text();
        const words = text.trim().split('\n');

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
    pauseTimer();

    document.querySelector('.offFocusMessage').style.opacity = '1';
    document.querySelector('.game').style.filter = 'blur(5px)';
});

document.querySelector('.game').addEventListener('focus', () => {
    resumeTimer();

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
    currentLetter.classList.remove('current');
    if (isBackspace && currentLetter.previousSibling) {
        if (currentLetter.previousSibling.nodeType !== 3) {
            currentLetter.previousSibling.classList.add('current');
        }
    } else {
        if (currentLetter.nextSibling) {
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

function manageSpaceCharacter(key, isBackspace, currentLetter) {
    if (
        key !== currentLetter.textContent &&
        !isBackspace &&
        currentLetter.textContent === ' '
    ) {
        const characterSpan = document.createElement('span');
        characterSpan.className = 'letter extraLetter incorrect';
        characterSpan.innerText = key;
        currentLetter.parentNode.replaceChild(characterSpan, currentLetter);
        currentLetter = characterSpan;
    }

    if (
        isBackspace &&
        currentLetter.previousSibling &&
        currentLetter.previousSibling.classList.contains('extraLetter')
    ) {
        const characterSpan = document.createElement('span');
        characterSpan.className = 'letter current';
        characterSpan.innerText = ' ';
        currentLetter.previousSibling.parentNode.replaceChild(
            characterSpan,
            currentLetter.previousSibling
        );
    }

    return currentLetter;
}

function calcWordsPerMinute(wordsTyped, secondsTaken) {
    if (secondsTaken === 0) return 0;
    return Math.round((wordsTyped / secondsTaken) * 60);
}

document.querySelector('.game').addEventListener('keyup', (event) => {
    const key = event.key;
    const isBackspace = key === 'Backspace';
    let currentLetter = document.querySelector('.current');

    if (!currentLetter) {
        if (isBackspace) {
            const allLetters = document.querySelectorAll('.letter');
            if (allLetters.length > 0) {
                currentLetter = allLetters[allLetters.length - 1];
                currentLetter.classList.add('current');
                currentLetter.classList.remove('correct');
                currentLetter.classList.remove('incorrect');
                return;
            }
        }
    }

    if (currentLetter) {
        moveCursor(isBackspace, currentLetter);
        moveCurrent(isBackspace, currentLetter);
        manageCorrectOrIncorrectStyle(key, isBackspace, currentLetter);
        currentLetter = manageSpaceCharacter(key, isBackspace, currentLetter);
    }

    const newCurrentLetter = document.querySelector('.current');
    if (!newCurrentLetter && !isBackspace) {
        if (document.querySelectorAll('.incorrect').length > 0) {
            pauseTimer();
            alert('You have some incorrect words! Please fix.');
            resumeTimer();
        } else {
            stopTimer();
            alert(
                `You typed ${numberOfWordsToType} words in ${secondsTaken} seconds!\nWords per minute: ${calcWordsPerMinute(
                    numberOfWordsToType,
                    secondsTaken
                )}`
            );
            resetGame();
        }
    }
});

function incrementSeconds() {
    secondsTaken++;
    document.querySelector('.timer').textContent = secondsTaken;
}

function pauseTimer() {
    if (secondsInterval && !isPaused) {
        clearInterval(secondsInterval);
        isPaused = true;
    }
}

function resumeTimer() {
    if (isPaused) {
        secondsInterval = setInterval(incrementSeconds, 1000);
        isPaused = false;
    }
}

function startTimer() {
    if (!secondsInterval && !isPaused) {
        secondsInterval = setInterval(incrementSeconds, 1000);
    }
}

function stopTimer() {
    if (secondsInterval) {
        clearInterval(secondsInterval);
        secondsInterval = null;
        isPaused = false;
    }
}

async function resetGame() {
    stopTimer();

    const randomWords = await getRandomWords('words.txt', numberOfWordsToType);
    displayWords(randomWords);

    document.querySelector('.letter').classList.add('current');
    document.querySelector('#cursor').style.left = '20px';

    secondsTaken = 0;
    document.querySelector('.timer').textContent = secondsTaken;
    startTimer();
}
resetGame();
