let charList = {};

const setCharacterList = (characterList) => {
  charList = characterList;
};

const setCharacter = (character) => {
  charList[character.hash] = character;
};


module.exports.setCharacterList = setCharacterList;
module.exports.setCharacter = setCharacter;
