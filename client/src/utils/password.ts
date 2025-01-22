const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const specialCharacters = '!@#$%^&*()<>?';
const allCharacters =
  upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

export const generatePassword = () => {
  let password = '';
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
};
