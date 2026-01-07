/* get elements */
const password = document.getElementById("pw-password")

const copyBtn = document.getElementById("pw-copy-btn")
const pwCopyMsg = document.getElementById("pw-copy-msg")

const pwOptionsForm = document.getElementById("pw-options-form")
const charLengthInput = document.getElementById("char-length-input")
const charLengthValue = document.getElementById("char-length-value")

const pwStrengthIndicator = document.getElementById("pw-strength-indicator")
const msgTooltip = document.getElementById("msg-tooltip")


/* data */
const uppercases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const lowercases = "abcdefghijklmnopqrstuvwxyz"
const numbers = "01234567890"
const symbols = "!@#$%^&*()_-+=[]{}.,?'\"/\\|"


/* event listeners */
pwOptionsForm.addEventListener("submit", (event) => {
    event.preventDefault()
    password.classList.remove("placeholder")
    const formData = Object.fromEntries(new FormData(event.target))
    const { newPassword, score } = generatePassword(formData)
    pwStrengthIndicator.classList.remove("too-weak", "weak", "medium", "strong")
    pwStrengthIndicator.classList.add(assignStrengthClass(score))
    password.textContent = newPassword
})


charLengthInput.addEventListener("input", (event) => {
    charLengthValue.textContent = event.target.value
})


copyBtn.addEventListener("click", () => {
    if (password !== "-") {
        navigator.clipboard.writeText(password.textContent)
        pwCopyMsg.classList.remove("hide")
        const id = setTimeout(() => {
            pwCopyMsg.classList.add("hide")
            clearTimeout(id)
        }, 5000)
    }
})


/* functions */
function generatePassword(formData) {
    msgTooltip.classList.add("hide")
    const { charLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = formData
    let characters = ""
    let score = 0

    if (includeUppercase) { characters += uppercases; score += 1 }
    if (includeLowercase) { characters += lowercases; score += 1 }
    if (includeNumbers) { characters += numbers; score += 2 }
    if (includeSymbols) { characters += symbols; score += 3 }
    if (charLength >= 15) { score += 2 }
    else if (charLength >= 8) { score += 1 }

    if (!score) {
        msgTooltip.textContent = "Please select at least one option from checkboxes."
        msgTooltip.classList.remove("hide")
        const id = setTimeout(() => {
            msgTooltip.classList.add("hide")
            clearTimeout(id)
        }, 5000)
    }
    if (!score) return { newPassword: "-", score }
    let newPassword = ""
    for (let i = 0; i < charLength; i++) {
        newPassword += characters[Math.floor(Math.random() * characters.length)]
    }
    return { newPassword, score }
}


function assignStrengthClass(score) {
    switch (score) {
        case 1: case 2: return "too-weak"
        case 3: case 4: case 5: return "weak"
        case 6: case 7: return "medium"
        case 8: case 9: return "strong"
        case 0: return "x"
    }
}