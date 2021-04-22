import React, {Component, useEffect} from 'react';
import {View,Page,Navbar,NavRight,Link,Popup,Popover,Icon,ListItem,List} from 'framework7-react';
import { withTranslation } from 'react-i18next';
import {f7} from 'framework7-react';
import {Device} from '../../../../../common/mobile/utils/device';
import ApplicationSettingsController from "../../controller/settings/ApplicationSettings";
import { MacrosSettings } from "./ApplicationSettings";
import DownloadController from "../../controller/settings/Download";
import PresentationInfoController from "../../controller/settings/PresentationInfo";
import PresentationSettingsController from "../../controller/settings/PresentationSettings";
import { PresentationColorSchemes } from "./PresentationSettings";
// import PresentationAboutController from '../../controller/settings/PresentationAbout';
import About from '../../../../../common/mobile/lib/view/About';

const routes = [
    {
        path: '/',
        component: 'TSettingsView'
    },
    {
        path: '/application-settings/',
        component: ApplicationSettingsController
    },
    {
        path: '/macros-settings/',
        component: MacrosSettings
    }, 
    {
        path: '/download/',
        component: DownloadController
    },
    {
        path: '/presentation-info/',
        component: PresentationInfoController
    },
    {
        path: '/presentation-settings/',
        component: PresentationSettingsController
    },
    {
        path: '/color-schemes/',
        component: PresentationColorSchemes
    },
    {
        path: '/about/',
        component: About
    }
    /*{
        path: '/presentation-settings/',
        component: PresentationSettingsController,
    },
    {
        path: "/presentation-info/",
        component: PresentationInfoController,
    }*/
];


const SettingsList = withTranslation()(props => {
    const {t} = props;
    const _t = t('View.Settings', {returnObjects: true});
    const navbar = <Navbar title={_t.textSettings}>
        {!props.inPopover  && <NavRight><Link popupClose=".settings-popup">{_t.textDone}</Link></NavRight>}
    </Navbar>;

    const onoptionclick = page => {
        if ( props.onOptionClick )
            props.onOptionClick(page)
    };

    const closeModal = () => {
        if (Device.phone) {
            f7.sheet.close('.settings-popup', true);
        } else {
            f7.popover.close('#settings-popover');
        }
    };

    const onPrint = () => {
        closeModal();
        const api = Common.EditorApi.get();
        api.asc_Print();
    };

    const showHelp = () => {
        // let url = '{{HELP_URL}}';
        let url = __HELP_URL__;
        // let url = 'https://helpcenter.onlyoffice.com';

        if (url.charAt(url.length-1) !== '/') {
            url += '/';
        }

        if (Device.sailfish || Device.android) {
            url+='mobile-applications/documents/mobile-web-editors/android/index.aspx';
        } 
        else {
            url+='mobile-applications/documents/mobile-web-editors/ios/index.aspx';
        }

        closeModal();
        window.open(url, "_blank");
    };

    return (
        <View style={props.style} stackPages={true} routes={routes}>
            <Page>
                {navbar}
                <List>
                    {!props.inPopover &&
                        <ListItem title={_t.textFindAndReplace} link="#" searchbarEnable='.searchbar' onClick={closeModal}>
                            <Icon slot="media" icon="icon-search"></Icon>
                        </ListItem>
                    }
                    <ListItem link="#" title={_t.textPresentationSettings} onClick={onoptionclick.bind(this, '/presentation-settings/')}>
                        <Icon slot="media" icon="icon-setup"></Icon>
                    </ListItem>
                    <ListItem title={_t.textApplicationSettings} link="#" onClick={onoptionclick.bind(this, '/application-settings/')}>
                        <Icon slot="media" icon="icon-app-settings"></Icon>
                    </ListItem>
                    <ListItem title={_t.textDownload} link="#" onClick={onoptionclick.bind(this, '/download/')}>
                        <Icon slot="media" icon="icon-download"></Icon>
                    </ListItem>
                    <ListItem title={_t.textPrint} onClick={onPrint}>
                        <Icon slot="media" icon="icon-print"></Icon>
                    </ListItem>
                    <ListItem title={_t.textPresentationInfo} link="#" onClick={onoptionclick.bind(this, "/presentation-info/")}>
                        <Icon slot="media" icon="icon-info"></Icon>
                    </ListItem>
                    <ListItem title={_t.textHelp} link="#" onClick={showHelp}>
                        <Icon slot="media" icon="icon-help"></Icon>
                    </ListItem>
                    <ListItem title={_t.textAbout} link="#" onClick={onoptionclick.bind(this, "/about/")}>
                        <Icon slot="media" icon="icon-about"></Icon>
                    </ListItem>
                </List>
            </Page>
        </View>
    )
});

class SettingsView extends Component {
    constructor(props) {
        super(props);

        this.onoptionclick = this.onoptionclick.bind(this);
    }

    onoptionclick(page){
        f7.views.current.router.navigate(page);
    }

    render() {
        const show_popover = this.props.usePopover;
        return (
            show_popover ?
                <Popover id="settings-popover" className="popover__titled" onPopoverClosed={() => this.props.onclosed()}>
                    <SettingsList inPopover={true} onOptionClick={this.onoptionclick} style={{height: '410px'}} />
                </Popover> :
                <Popup className="settings-popup" onPopupClosed={() => this.props.onclosed()}>
                    <SettingsList onOptionClick={this.onoptionclick} />
                </Popup>
        )
    }
}

const Settings = props => {
    useEffect(() => {
        if ( Device.phone )
            f7.popup.open('.settings-popup');
        else f7.popover.open('#settings-popover', '#btn-settings');

        return () => {
        }
    });


    const onviewclosed = () => {
        if ( props.onclosed )
            props.onclosed();
    };

    return <SettingsView usePopover={!Device.phone} onclosed={onviewclosed} />
};

export default Settings;