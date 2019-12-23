/*
Copyright (c) 2019 takisai
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/
'use strict';

// dgebi :: String -> Maybe Element
const dgebi = id => document.getElementById(id);

// home :: () -> ()
const home = () => {
    dgebi('main').style.display = 'none';
    dgebi('help').style.display = 'none';
    dgebi('home').style.display = 'flex';
};

// main :: () -> ()
const main = () => {
    dgebi('home').style.display = 'none';
    dgebi('main').style.display = 'flex';

    dgebi('time_label').innerHTML = 'クリック/タップでスタート';
    dgebi('level').innerText = '1.000';
    dgebi('level_up_count').innerText = '0';
    dgebi('score').innerText = '0';
    dgebi('result').style.visibility = 'hidden';

    // clickCount :: NaturalNumber;  power :: Number
    let clickCount = 0, power = 1;
    dgebi('main').addEventListener('click', () => {
        dgebi('time_label').innerHTML = '秒数: <span id="time">0</span>';
        const startTime = Date.now(); // startTime :: DateNumber
        // f :: Number -> Number
        const f = x => x > Math.E ? x * Math.log(x) :  x * x / Math.E;
        let milestone = {score: 0, time: startTime}; // milestone :: Object
        // getScore :: () -> Number
        const getScore = () => {
            const now = Date.now();
            return milestone.score + power * f((now - milestone.time) / 1000);
        };
        // format :: (Number, NaturalNumber) -> String
        const format = (x, cut) => {
            const str = String(Math.round(x * 10 ** cut)); // str :: String
            const head = str.length - cut; // head :: NaturalNumber
            if(head <= 0) {
                return '0.' + '0'.repeat(-head) + str;
            }
            return str.slice(0, head) + '.' + str.slice(head);
        };
        // update :: () -> ()
        const update = () => {
            milestone.score = getScore();
            milestone.time = Date.now();
            power = milestone.score ** (1 / 3.0);
            clickCount++;
            dgebi('level').innerText = format(power, 3);
            dgebi('level_up_count').innerText = clickCount;
        }
        dgebi('main').addEventListener('click', update);
        // id :: TimeoutID
        const id = window.setInterval(() => {
            const now = Date.now(); // now :: DateNumber
            dgebi('time').innerText = format((now - startTime) / 1000, 1);
            dgebi('score').innerText = format(getScore(), 3);
            if(now - startTime > 60000) {
                dgebi('time').innerText = '60.0';
                window.clearInterval(id);
                dgebi('main').removeEventListener('click', update);
                // levelUpCount :: String
                const levelUpCount = dgebi('level_up_count').innerText;
                const score = dgebi('score').innerText; // score :: String
                // result :: String
                const result = `${levelUpCount}回レベルアップして${score}点獲得しました！`;
                // url :: String
                const url = `https://twitter.com/intent/tweet?text=${encodeURI(result)}%20%23%E3%83%AC%E3%83%99%E3%83%AB%E4%B8%8A%E3%81%92%E8%A1%8C%E7%82%BA%20https%3A%2F%2Ftakisai.github.io%2Fearnexp%2F`;
                dgebi('share').setAttribute('href', url);
                // textarea :: String
                const textarea = result + ' https://takisai.github.io/earnexp/ #レベル上げ行為';
                dgebi('result_main').value = textarea;
                dgebi('result').style.visibility = 'visible';
            }
        }, 50);
    }, {once: true});
};

// help :: () -> ()
const help = () => {
    dgebi('home').style.display = 'none';
    dgebi('help').style.display = 'flex';
};

home();
