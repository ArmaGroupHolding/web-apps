import React, { useContext } from 'react';
import { Page, Navbar, NavRight, Link, Icon, ListItem, List, Toggle } from 'framework7-react';
import { Device } from "../../../../../common/mobile/utils/device";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';

const SettingsPage = inject("storeAppOptions", "storeReview", "storeDocumentInfo")(observer(props => {
    const { t } = useTranslation();
    const _t = t('Settings', {returnObjects: true});
    const appOptions = props.storeAppOptions;
    const canProtect = appOptions.canProtect;
    const storeReview = props.storeReview;
    const displayMode = storeReview.displayMode;
    const docInfo = props.storeDocumentInfo;
    const docTitle = docInfo.dataDoc.title;
    const docExt = docInfo.dataDoc ? docInfo.dataDoc.fileType : '';
    const isNotForm = docExt && docExt !== 'oform';
    const navbar =
        <Navbar>
            <div className="title" data-action={'rename'}>{docTitle}</div>
            {Device.phone && <NavRight><Link popupClose=".settings-popup">{_t.textDone}</Link></NavRight>}
        </Navbar>;

    // set mode
    const isViewer = appOptions.isViewer;
    const isMobileView = appOptions.isMobileView;
  
    let _isEdit = false,
        _canDownload = false,
        _canDownloadOrigin = false,
        _canAbout = true,
        _canHelp = true,
        _canPrint = false,
        _canFeedback = true;

    if (appOptions.isDisconnected) {
        _isEdit = false;
        if (!appOptions.enableDownload)
            _canPrint = _canDownload = _canDownloadOrigin = false;
    } else {
        _isEdit = appOptions.isEdit;
        _canDownload = appOptions.canDownload;
        _canDownloadOrigin = appOptions.canDownloadOrigin;
        _canPrint = appOptions.canPrint;

        if (appOptions.customization && appOptions.canBrandingExt) {
            _canAbout = appOptions.customization.about !== false;
        }

        if (appOptions.customization) {
            _canHelp = appOptions.customization.help !== false;
            _canFeedback = appOptions.customization.feedback !== false;
        }
    }

    return (
        <Page>
            {navbar}
            <List>
                {Device.phone &&
                    <ListItem data-action={'close-modal'} title={!_isEdit || isViewer ? _t.textFind : _t.textFindAndReplace} link='#' searchbarEnable='.searchbar' className='no-indicator'>
                        <Icon slot="media" icon="icon-search"></Icon>
                    </ListItem>
                }
                {(_isEdit && canProtect) &&
                    <ListItem title={t('Settings.textProtection')} link="/protection">
                        <Icon slot="media" icon="icon-protection" />
                    </ListItem>
                }
                <ListItem title={t('Settings.textNavigation')} link={!Device.phone ? '/navigation' : '#'}
                            data-action={Device.phone ? 'navigation' : null}>
                    <Icon slot="media" icon="icon-navigation"></Icon>
                </ListItem>
                {window.matchMedia("(max-width: 359px)").matches ?
                    <ListItem title={_t.textCollaboration} link="#" data-action={'coauth'} className='no-indicator'>
                        <Icon slot="media" icon="icon-collaboration"></Icon>
                    </ListItem>
                    : null}
                {Device.sailfish && _isEdit &&
                    <ListItem data-action={'check-orpho'} title={_t.textSpellcheck} className='no-indicator' link="#">
                        <Icon slot="media" icon="icon-spellcheck"></Icon>
                    </ListItem>
                }
                {!isViewer && Device.phone &&
                    <ListItem title={t('Settings.textMobileView')}>
                        <Icon slot="media" icon="icon-mobile-view"></Icon>
                        <Toggle data-action={'turn-mobile-view'} checked={isMobileView} />
                    </ListItem>
                }
                {(_isEdit && !isViewer) &&
                    <ListItem title={_t.textDocumentSettings} disabled={displayMode !== 'markup'} link='/document-settings/'>
                        <Icon slot="media" icon="icon-doc-setup"></Icon>
                    </ListItem>
                }
                {isNotForm &&
                    <ListItem title={_t.textApplicationSettings} link="/application-settings/">
                        <Icon slot="media" icon="icon-app-settings"></Icon>
                    </ListItem>
                }
                {_canDownload &&
                    <ListItem title={_t.textDownload} link="/download/">
                        <Icon slot="media" icon="icon-download"></Icon>
                    </ListItem>
                }
                {_canDownloadOrigin &&
                    <ListItem data-action={'download'} title={_t.textDownload} link="#" className='no-indicator'>
                        <Icon slot="media" icon="icon-download"></Icon>
                    </ListItem>
                }
                {_canPrint &&
                    <ListItem data-action={'print'} title={_t.textPrint} link='#' className='no-indicator'>
                        <Icon slot="media" icon="icon-print"></Icon>
                    </ListItem>
                }
                <ListItem title={_t.textDocumentInfo} link="/document-info/">
                    <Icon slot="media" icon="icon-info"></Icon>
                </ListItem>
                {_canHelp &&
                    <ListItem data-action={'help'} title={_t.textHelp} link="#" className='no-indicator'>
                        <Icon slot="media" icon="icon-help"></Icon>
                    </ListItem>
                }
                {(_canAbout && isNotForm) &&
                    <ListItem title={_t.textAbout} link="/about/">
                        <Icon slot="media" icon="icon-about"></Icon>
                    </ListItem>
                }
                {_canFeedback &&
                    <ListItem data-action={'feedback'} title={t('Settings.textFeedback')} link="#" className='no-indicator'>
                        <Icon slot="media" icon="icon-feedback"></Icon>
                    </ListItem>
                }
            </List>
        </Page>
    )
}));

export default SettingsPage;