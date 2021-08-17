import React, { createContext, useState, useEffect, CSSProperties } from 'react';



// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const ThemeContext = createContext<Type_ThemeContext>();



interface Type_ThemeContext {
    styles: MyCustomCSS
    changeTheme: any
}


export interface MyCustomCSS extends CSSProperties {
    '--color-primary': string
    '--color-primary-dark25': string
    '--color-secondary-light87': string
    '--color-secondary-light50': string
    '--color-secondary-light25': string
    '--color-secondary': string
    '--color-secondary-dark25': string
    '--color-CTA': string
    '--color-CTA-light25': string
    '--color-CTA-dark25': string
    '--color-background': string
    '--color-light': string
    '--color-text-darkbackground': string
    '--color-text-lightbackground': string
}


const lightMode = {
    '--color-primary-light50' : '#C5DDDD',
    '--color-primary-light25' : '#A8CCCD',
    '--color-primary': '#8BBABC',
    '--color-primary-dark25': '#59999B',
    '--color-secondary-light87': '#DEE3EC',
    '--color-secondary-light50': '#7990B4',
    '--color-secondary-light25': '#475C7E',
    '--color-secondary': '#212B3B',
    '--color-secondary-dark25': '#19202C',
    '--color-CTA': '#FFC20A',
    '--color-CTA-light25': '#FFD147',
    '--color-CTA-dark25': '#C79500',
    '--color-background': '#E7EAEE',
    '--color-background-light' : '#F3F5F7',
    '--color-light': '#F3F5F7',
    '--color-text-darkbackground': 'white',
    '--color-text-lightbackground': 'black',
    '--color-boxshadow-1' : 'rgba(154,160,185,.05)',
    '--color-boxshadow-2' : 'rgba(166,173,201,.2)',
    '--color-red' : '#CC0000',
    '--color-green' : '#03C03C'
}

const darkMode = {
    '--color-primary-light50' : '#7990B4',
    '--color-primary-light25' : '#475C7E',
    '--color-primary': '#212B3B',
    '--color-primary-dark25': '#19202C',

    
    // this is not the right color below~1
    '--color-secondary-light87': '#617389',
    '--color-secondary-light50': '#C5DDDD',
    '--color-secondary-light25': '#A8CCCD',
    '--color-secondary': '#8BBABC',
    '--color-secondary-dark25': '#59999B',
    '--color-CTA': '#FFC20A',
    '--color-CTA-light25': '#FFD147',
    '--color-CTA-dark25': '#C79500',
    '--color-background': '#181D22',
    '--color-background-light' : '#495667',
    '--color-light': '#000',
    '--color-text-darkbackground': 'black',
    '--color-text-lightbackground': 'lightgrey',
    '--color-boxshadow-1' : 'rgba(154,160,185,.00)',
    '--color-boxshadow-2' : 'rgba(166,173,201,.0)',
    '--color-red' : '#E23D28',
    '--color-green' : '#50C878'
}

const ThemeEngine = ({ children }: any) => {
    const [theme, updateTheme] = useState('lightMode')

    const [ styles, setStyles  ] = useState<MyCustomCSS>(() => lightMode)
    


    const changeTheme = () => {
        updateTheme( prevTheme => {
            if(prevTheme === 'lightMode') {
                setStyles(darkMode)
                return 'darkMode'
            } else {
                setStyles(lightMode)
                return 'lightMode'
            }
        })
    }


    return (
        <ThemeContext.Provider value={{styles, changeTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}


const useThemeProvidor = () => {
    const context = React.useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            "useGlobalState must be used within a GlobalContextProvider"
        );
    }
    return context;
};

export {  ThemeEngine, useThemeProvidor }