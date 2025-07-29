const randomWords = ['hello', 'goodbye', 'cat', 'dog'];

const wordsToShow = randomWords.join(' ');

const charactersToShow = wordsToShow.split('');
let currentCharacterIndex = 0;

charactersToShow.forEach((character) => {
    const characterSpan = document.createElement('span');
    characterSpan.className = 'letter';
    characterSpan.innerText = character;
    document.querySelector('.words').appendChild(characterSpan);
});

document.querySelector('.letter').className = 'letter current';

document.querySelector('.game').addEventListener('blur', (event) => {
    console.log(event);
    document.querySelector('.offFocusMessage').style.opacity = '1';
    document.querySelector('.game').style.filter = 'blur(5px)';
});

document
    .querySelector('.offFocusMessage')
    .addEventListener('click', (event) => {
        document.querySelector('.game').focus();
    });

document.querySelector('.game').addEventListener('focus', (event) => {
    console.log(event);
    document.querySelector('.offFocusMessage').style.opacity = '0';
    document.querySelector('.game').style.filter = 'blur(0)';
});

document.querySelector('.game').addEventListener('keyup', (event) => {
    console.log(event);
    const keyPressed = event.key;
    const key = event.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';

    const cursor = document.querySelector('#cursor');
    // const isFirstLetter = currentLetter === currentWord.firstChild;

    console.log(key, currentLetter.textContent);

    if (key == document.querySelector('.current').textContent) {
        currentLetter.classList.add('correct');
    } else {
        if (key !== 'Backspace') {
            currentLetter.classList.add('incorrect');
        }
    }

    currentLetter.classList.remove('current');
    if (isBackspace) {
        cursor.style.left = getBoundingClientRect() + 'px';
        currentLetter.previousSibling.classList.add('current');
    } else {
        currentLetter.nextSibling.classList.add('current');
        cursor.style.left =
            currentLetter.nextSibling.getBoundingClientRect().left + 'px';
        console.log(currentLetter.getBoundingClientRect().x);
    }
});
