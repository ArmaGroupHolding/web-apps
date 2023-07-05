
const load_stylesheet = reflink => {
    let link = document.createElement( "link" );
    link.href = reflink;
    // link.type = "text/css";
    link.rel = "stylesheet";

    document.getElementsByTagName("head")[0].appendChild(link);
};

if ( localStorage && localStorage.getItem('mobile-mode-direction') === 'rtl' ) {
    load_stylesheet('./css/framework7-rtl.css')
    document.body.classList.add('rtl');
} else {
    load_stylesheet('./css/framework7.css')
}

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

window.uitheme = {
    select: window.native?.theme.select || true,
    // relevant_theme_id: function () {
    //     if ( this.is_theme_system() )
    //         return this.is_system_theme_dark() ? 'theme-dark' : 'theme-light';
    //     return this.id;
    // },
    relevant_theme_type: function () {
        if ( this.is_theme_system() )
            return this.is_system_theme_dark() ? 'dark' : 'light';
        return this.type;
    },
    is_system_theme_dark: function () {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    is_theme_system: function () {
        return this.id == 'theme-system';
    },
    // set_id: function (id) {
    //     if ( id == 'theme-system' ) {
    //         this.id = 'theme-system';
    //         this.type = this.is_system_theme_dark() ? 'dark' : 'light';
    //     } else this.id = id;
    // },
    init_from_type: function (type) {
        if ( type == 'dark' ) { this.id = 'theme-dark'; this.type = type; }
        else if ( type == 'light' ) { this.id = 'theme-light'; this.type = type; }
        else { this.id = 'theme-system'; this.type = 'system'; }
    },
}

if ( !!window.native ) {
    window.uitheme.init_from_type(window.native.editorConfig.theme.type);
} else {
    const obj = !localStorage ? null : JSON.parse(localStorage.getItem("mobile-ui-theme"));
    if ( !obj ) {
        window.uitheme.init_from_type('system');
        // const obj = get_system_theme_type() == 'dark' ?
        //     {id: 'theme-dark', type: 'dark'} : {id: 'theme-light', type: 'light'};
        // localStorage && localStorage.setItem("mobile-ui-theme", JSON.stringify(obj));
    } else {
        window.uitheme.id = obj.id;
        window.uitheme.type = obj.type;
    }
}

document.body.classList.add(`theme-type-${window.uitheme.relevant_theme_type()}`, `${window.asceditor}-editor`);
