let audioUrl;
    const userSearch = document.getElementById('userSearch');
    const wordSearch = document.getElementById('wordSearch');
    const phoneticText = document.getElementById('phoneticText');
    const playWord = document.getElementById('playWord');
    const partSpeech = document.getElementById('partSpeech');
    const audioContainer = document.getElementById('audioContainer');

    const renderData = (data) => {
        partSpeech.innerHTML = '';
        data.forEach(item => {
            wordSearch.textContent = item.word.toUpperCase();

            const phonetic = item.phonetics.find(p => p.text);
            phoneticText.textContent = phonetic ? phonetic.text : 'N/A';

            const audio = item.phonetics.find(p => p.audio);
            audioUrl = audio ? audio.audio : null;

            
            audioContainer.style.opacity = audioUrl ? '1' : '0.3';
            audioContainer.style.cursor = audioUrl ? 'pointer' : 'default';

            item.meanings.forEach(meaning => {
                meaning.definitions.forEach(def => {
                    partSpeech.innerHTML += `
                        <tr>
                            <td>${meaning.partOfSpeech}</td>
                            <td>${def.definition.length > 100 ? def.definition.slice(0, 100) + '...' : def.definition}</td>
                            <td>${meaning.synonyms?.join(', ') || '—'}</td>
                        </tr>`;
                });
            });
        });
    };

    const searchWord = () => {
        const query = userSearch.value.trim();
        if (!query) return;

        wordSearch.textContent = "Loading...";
        phoneticText.textContent = "";
        partSpeech.innerHTML = "";

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
            .then(res => res.json())
            .then(data => renderData(data))
            .catch(err => {
                wordSearch.textContent = "Not Found";
                phoneticText.textContent = "";
                partSpeech.innerHTML = `<tr><td colspan="3">No definition found.</td></tr>`;
            });
    };

    userSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchWord();
    });

    window.addEventListener('load', () => {
        fetch('https://random-word-api.herokuapp.com/word?number=1')
            .then(res => res.json())
            .then(([wordObj]) => {
                const word = wordObj;                
                fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                    .then(res => res.json())
                    .then(data => renderData(data))
                    .catch(err => {
                        wordSearch.textContent = "Not Found";
                        phoneticText.textContent = "";
                        partSpeech.innerHTML = `<tr><td colspan="3">No definition found.</td></tr>`;
                    });
            });
    });

    playWord.addEventListener('click', () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            playWord.innerHTML = `<i class="fa-solid fa-ear-listen"></i>`;
            audio.play();
            audio.addEventListener('ended', () => {
                playWord.innerHTML = `<i class="fa-solid fa-volume-low"></i>`;
            });
        }
    });