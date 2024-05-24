import { createI18n } from 'vue-i18n'

export default createI18n({
  globalInjection: true,
  locale: localStorage.getItem("locale") || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'fi',
  preserveDirectiveContent: false,
  messages: {
    // Finnish translations
    fi: {
        info: { // info-panel
            header: "Tietoa",
            title: "Tietoa",
            p1:"Opendata on STUKin kehittämä avoimen lähdekoodin applikaatio, jolla voit tarkastella Suomen ulkoisen säteilyn valvontaverkon mittaustuloksia. Applikaatio saa datansa Ilmatieteen laitoksen avoimen datan rajapinnasta.",
            p2:"Lue lisää projektin <a href='https://github.com/StukFi/opendata' target='_blank'>GitHub-sivuilta</a>.",
        },
        settings: { // settingspanel
            title: "Asetukset",
            header: "Asetukset",
            language: "Kieli",
            date: "Päivitä päivämäärää",
            time: "Päivitä kellonaikaa",
            dateFormat: "Päiväyksen muoto",
            dateFormatA: "PP.KK.VVVV",
            dateFormatB: "VVV-KK-PP",
            labelFinnish: "Suomi",
            labelEnglish: "Englanti",
            timeFormat: "Ajan esitysmuoto",
            timeFormatA: "24 tunnin kello",
            timeFormatB: "12 tunnin kello",
        },
        playback: { // media-controller
            title: {
                disabled: {
                    date: "Valitse aikaisempi päivämäärä",
                    time: "Valitse aikaisempi kellonaika",
                },
            start: "Aloita toisto",
            stop: "Pysäytä toisto",
            speed: "Toistonopeus"
            }
        },
        dose: { // layers
            doseRateTresholds: "Annosnopeusrajat",
        }
    },
    // English translations
    en: {
        info: { // info-panel
            header: "About",
            title: "About",
            p1:"Opendata is an open source application developed by STUK that enables viewing of external radiation results from around Finland. The application gets its data from the Finnish Meteorological Institute's open data API.",
            p2:"To learn more visit the project on <a href='https://github.com/StukFi/opendata' target='_blank'>GitHub</a>.",
        },
        settings: { // settingspanel
            title: "Settings",
            header: "Settings",
            language: "Language",
            date: "Update date",
            time: "Update time",
            dateFormat: "Date format",
            dateFormatA: "DD.MM.YYYY",
            dateFormatB: "YYYY.MM.DD",
            labelFinnish: "Finnish",
            labelEnglish: "English",
            timeFormat: "Time notation",
            timeFormatA: "24-hour clock",
            timeFormatB: "12-hour clock",
        },
        playback: { // media-controller
            title: {
                disabled: {
                    date: "Choose an earlier date to nable playback",
                    time: "Choose an earlier time to enable playback",
                },
            start: "Start playback",
            stop: "Stop playback",
            speed: "Playback speed"
            }
        },
        dose: { // layers
            doseRateTresholds: "Dose rate thresholds",
        }
    },
  }
})
