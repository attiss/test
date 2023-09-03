(() => {
    'use strict'

    // remove indentation from <pre> blocks
    document.querySelectorAll('pre').forEach(function (code) {
        let lines = code.textContent.split('\n');

        if (lines[0] === '') {
            lines.shift()
        }

        var matches;
        var indentation = (matches = /^[\s\t]+/.exec(lines[0])) !== null ? matches[0] : null;
        if (!!indentation) {
            lines = lines.map(function (line) {
                line = line.replace(indentation, '')
                return line.replace(/\t/g, '    ')
            });

            code.textContent = lines.join('\n').trim();
        }
    });

    // inject attendeeids
    attendee.addEventListener("input", function () {
        let attendee = document.getElementById('attendee');
        let matches = attendee.value.match(/[Aa]ttila.[Ss]zucs7\+([0-9][0-9])@mail.test.ibm.com/);
        if (!matches) {
            attendee.classList.remove("is-valid");
            attendee.classList.add("is-invalid");

            let attendeeIds = Array.from(document.getElementsByClassName('attendeeid'));
            attendeeIds.forEach(function (attendeeId) {
                attendeeId.innerText = 'XX';
            });
        } else {
            attendee.classList.remove("is-invalid");
            attendee.classList.add("is-valid");

            let attendeeIds = Array.from(document.getElementsByClassName('attendeeid'));
            attendeeIds.forEach(function (attendeeId) {
                attendeeId.innerText = matches[1];
            });
        }
    });

    // activate tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(tooltip => {
        new bootstrap.Tooltip(tooltip, {
            trigger: 'hover'
        })
    })

})()

// copy to clipboard
async function copyContent(id) {
    const text = document.getElementById(id).innerText;

    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error(`Failed to copy content to clipboard: ${err}`);
        return
    }

    const tooltip = bootstrap.Tooltip.getInstance(`#${id}-btn`);
    tooltip.setContent({ '.tooltip-inner': 'copied' });
    setTimeout(() => { tooltip.setContent({ '.tooltip-inner': 'copy to clipboard' }); }, 2000);

    setCookie('attendee', text, 1);
}

// set cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

// get cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// check cookie on load
function checkCookie() {
    let email = getCookie('attendee');
    if (!email) {
        let attendee = document.getElementById('attendee');
        attendee.value = email;
    }
}
