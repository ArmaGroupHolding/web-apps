
const load_stylesheet = reflink => {
    let link = document.createElement( "link" );
    link.href = reflink;
    // link.type = "text/css";
    link.rel = "stylesheet";

    document.getElementsByTagName("head")[0].appendChild(link);
};

if ( !!window.Android && window.Android.editorConfig ) {
    const native_config = window.Android.editorConfig();
    const editor_config = {
        forceedit: !!native_config.forceedit,
        theme: {
            type: native_config.theme?.type,
            select: native_config.theme && native_config.theme.select === false ? false : true,
        }
    };

    if ( editor_config.theme.type && editor_config.theme.select === false ) {
    } else {
        const saved_theme = !localStorage ? null : JSON.parse(localStorage.getItem("mobile-ui-theme"));
        editor_config.theme.type = saved_theme?.type || 'system';
    }

    window.native = {editorConfig: editor_config};
}

if ( localStorage && localStorage.getItem('mobile-mode-direction') === 'rtl' ) {
    load_stylesheet('./css/framework7-rtl.css')
    document.body.classList.add('rtl');
} else {
    load_stylesheet('./css/framework7.css')
}

const get_system_theme_type = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

let obj;
if ( !!window.native ) {
    obj = {type: window.native.editorConfig.theme.type === 'system' ?
                    get_system_theme_type() : window.native.editorConfig.theme.type};
} else {
    obj = !localStorage ? null : JSON.parse(localStorage.getItem("mobile-ui-theme"));
    if ( !obj ) {
        obj = get_system_theme_type() == 'dark' ?
            {id: 'theme-dark', type: 'dark'} : {id: 'theme-light', type: 'light'};
        localStorage && localStorage.setItem("mobile-ui-theme", JSON.stringify(obj));
    }
}

document.body.classList.add(`theme-type-${obj.type}`, `${window.asceditor}-editor`);
