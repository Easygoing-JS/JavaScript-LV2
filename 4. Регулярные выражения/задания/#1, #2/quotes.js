/**
 * 1. Дан большой текст, в котором для оформления прямой речи используются одинарные кавычки.
 * Придумать шаблон, который заменяет одинарные кавычки на двойные.
 * 2. Улучшить шаблон так, чтобы в конструкциях типа aren't одинарная кавычка не заменялась на двойную.
 */

function textCheck() {
    let sourceStr = document.getElementById('source').value;
    let regexp1 = new RegExp('\'', 'gm');
    let regexp2 = /\b\"\b/gm;
    let correctedStr = sourceStr.replace(regexp1, '"');
    correctedStr = correctedStr.replace(regexp2, '\'');
    document.getElementById('output').value = correctedStr;
}
document.getElementById('source').addEventListener("keyup", textCheck);