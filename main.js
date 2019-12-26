/*
Copyright (c) 2019 takisai
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/
'use strict';

// dgebi :: String -> Maybe Element
const dgebi = id => document.getElementById(id);

const secret = (() => {
    const table = [1, 2, 5, 10]; // table :: [NaturalNumber]
    let count, isValid; // count :: NaturalNumber;  isValid :: Bool

    return {
        // secret.reset :: () -> ()
        reset: () => {
            count = 0;
            isValid = true;
            table.forEach(x => {
                dgebi('mode_' + x).setAttribute('onclick', `main(${x})`);
            });
        },
        // secret.do :: () -> ()
        do: () => {
            if(!isValid) return;
            count++;
            if(count < 5) return;
            table.forEach(x => {
                dgebi('mode_' + x).setAttribute('onclick', `main(${x}, true)`);
            });
            isValid = false;
        }
    };
})();

// home :: () -> ()
const home = () => {
    dgebi('main').style.display = 'none';
    dgebi('help').style.display = 'none';
    dgebi('home').style.display = 'flex';
};

// menu :: () -> ()
const menu = () => {
    dgebi('home').style.display = 'none';
    dgebi('menu').style.display = 'flex';
    secret.reset();
};

// main :: (NaturalNumber, Bool) -> ()
const main = (mode, isSecret = false) => {
    const readableMode = mode + '分'; // readableMode :: String
    mode *= 60000;
    dgebi('menu').style.display = 'none';
    dgebi('main').style.display = 'flex';

    dgebi('time_label').innerHTML = 'クリック/タップでスタート';
    dgebi('level').innerText = '1.000';
    dgebi('level_up_count').innerText = '0';
    dgebi('score').innerText = '0';
    dgebi('secret_score').innerText = '';
    dgebi('result').style.visibility = 'hidden';

    // clickCount :: NaturalNumber;  power :: Number
    let clickCount = 0, power = 1;
    dgebi('main').addEventListener('click', () => {
        // format :: (Number, NaturalNumber) -> String
        const format = (x, cut) => {
            const str = String(Math.round(x * 10 ** cut)); // str :: String
            const head = str.length - cut; // head :: NaturalNumber
            if(head <= 0) {
                return '0.' + '0'.repeat(-head) + str;
            }
            return str.slice(0, head) + '.' + str.slice(head);
        };
        // timeFormat :: DateNumber -> String
        const timeFormat = time => {
            let ret = ''; // ret :: String
            if(time >= 60000) {
                ret = Math.floor(time / 60000) + ':';
                time = time % 60000;
            }
            if(ret !== '' && time < 9950) {
                ret += '0';
            }
            return ret + format(time / 1000, 1);
        };
        // timeLabel :: String
        const timeLabel = '時間: <span id="time">0.0</span> / ';
        // formattedMode :: String
        const formattedMode = `<span id="time_max">${timeFormat(mode)}</span>`;
        dgebi('time_label').innerHTML = timeLabel + formattedMode;
        const startTime = Date.now(); // startTime :: DateNumber
        // f :: Number -> Number
        const f = x => x > Math.E ? x * Math.log(x) :  x * x / Math.E;
        let milestone = {score: 0, time: startTime}; // milestone :: Object
        // getScore :: DateNumber -> Number
        const getScore = (now = Date.now()) => {
            return milestone.score + power * f((now - milestone.time) / 1000);
        };
        // update :: () -> ()
        const update = () => {
            milestone.score = getScore();
            milestone.time = Date.now();
            power = Math.max(1, milestone.score ** (1 / 3.0));
            clickCount++;
            dgebi('level').innerText = format(power, 3);
            dgebi('level_up_count').innerText = clickCount;
        }
        dgebi('main').addEventListener('click', update);
        // id :: TimeoutID
        const id = window.setInterval(() => {
            const now = Date.now(); // now :: DateNumber
            // subst :: DateNumber
            const subst = Math.min(now - startTime, mode);
            if(isSecret) {
                // predict :: String
                const predict = format(getScore(startTime + mode), 1);
                dgebi('secret_score').innerText = ` (予測値: ${predict})`;
            }
            if(subst < mode) {
                dgebi('score').innerText = format(getScore(), 3);
                dgebi('time').innerText = timeFormat(now - startTime);
            } else {
                const t = startTime + mode; // t :: DateNumber
                dgebi('score').innerText = format(getScore(t), 3);
                dgebi('time').innerText = timeFormat(mode);
                window.clearInterval(id);
                dgebi('main').removeEventListener('click', update);
                // levelUpCount :: String
                const levelUpCount = dgebi('level_up_count').innerText;
                const score = dgebi('score').innerText; // score :: String
                // result :: String
                const result = `${readableMode}で${levelUpCount}回レベルアップして${score}点獲得しました！`;
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
