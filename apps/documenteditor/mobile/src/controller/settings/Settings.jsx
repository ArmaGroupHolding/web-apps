import React, { createContext, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { f7 } from 'framework7-react';
import { observer, inject } from "mobx-react";
import { Device } from '../../../../../common/mobile/utils/device';
import SettingsView from "../../view/settings/Settings";
import { LocalStorage } from "../../../../../common/mobile/utils/LocalStorage.mjs";
import { MainContext } from "../../page/main";

export const SettingsContext = createContext();

const SettingsController = props => {
    const storeDocumentInfo = props.storeDocumentInfo;
    const { t } = useTranslation();
    const mainContext = useContext(MainContext);

    const closeModal = () => {
        if(Device.phone) {
            f7.sheet.close('.settings-popup', false);
        } else {
            f7.popover.close('#settings-popover', false);
        }
    };

    const onPrint = () => {
        const api = Common.EditorApi.get();

        closeModal();
        setTimeout(() => {
            api.asc_Print();
        }, 400);
    };

    const showHelp = () => {
        let url = __HELP_URL__;

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
        setTimeout(() => {
            window.open(url, "_blank");
        }, 400);
    };

    const showFeedback = () => {
        let config = props.storeAppOptions.config;

        closeModal();
        setTimeout(() => {
            if(config && !!config.feedback && !!config.feedback.url) {
                window.open(config.feedback.url, "_blank");
            } else window.open(__SUPPORT_URL__, "_blank");
        }, 400);
    }

    const onOrthographyCheck = () => {
        closeModal();
        setTimeout(() => {
            Common.EditorApi.get().asc_pluginRun("asc.{B631E142-E40B-4B4C-90B9-2D00222A286E}", 0);
        }, 400);
    };

    const onDownloadOrigin = () => {
        closeModal();
        setTimeout(() => {
            Common.EditorApi.get().asc_DownloadOrigin();
        }, 0);
    };

    const onChangeMobileView = () => {
        const api = Common.EditorApi.get();
        const appOptions = props.storeAppOptions;
        const isMobileView = appOptions.isMobileView;

        LocalStorage.setBool('mobile-view', !isMobileView);
        appOptions.changeMobileView();
        api.ChangeReaderMode();
    };

    const changeTitleHandler = () => {
        const docTitle = storeDocumentInfo.dataDoc.title;

        f7.dialog.create({
            title: t('Toolbar.textRenameFile'),
            text : t('Toolbar.textEnterNewFileName'),
            content: Device.ios ?
            '<div class="input-field"><input type="text" class="modal-text-input" name="modal-title" id="modal-title"></div>' : '<div class="input-field modal-title"><div class="inputs-list list inline-labels"><ul><li><div class="item-content item-input"><div class="item-inner"><div class="item-input-wrap"><input type="text" name="modal-title" id="modal-title"></div></div></div></li></ul></div></div>',
            cssClass: 'dlg-adv-options',
            buttons: [
                {
                    text: t('Edit.textCancel')
                },
                {
                    text: t('Edit.textOk'),
                    cssClass: 'btn-change-title',
                    bold: true,
                    close: false,
                    onClick: () => {
                        const titleFieldValue = document.querySelector('#modal-title').value;
                        if(titleFieldValue.trim().length) {
                            changeTitle(titleFieldValue);
                            f7.dialog.close();
                        }
                    }
                }
            ],
            on: {
                opened: () => {
                    const nameDoc = docTitle.split('.')[0];
                    const titleField = document.querySelector('#modal-title');
                    const btnChangeTitle = document.querySelector('.btn-change-title');

                    titleField.value = nameDoc;
                    titleField.focus();
                    titleField.select();

                    titleField.addEventListener('input', () => {
                        if(titleField.value.trim().length) {
                            btnChangeTitle.classList.remove('disabled');
                        } else {
                            btnChangeTitle.classList.add('disabled');
                        }
                    });
                }
            }
        }).open();
    };

    useEffect(() => {
        $$('li').on('click', `[data-action=feedback], [data-action=help], [data-action=print],
                                [data-action=download], [data-action=check-orpho], [data-action=close-modal],
                                [data-action=coauth], [data-action=navigation]`,
            e => {
                const action = $$(e.currentTarget).data('action');
                if ( action === 'feedback' ) {
                    showFeedback();
                } else
                if ( action === 'help' ) {
                    showHelp();
                } else
                if ( action === 'print' ) {
                    onPrint();
                } else
                if ( action === 'download' ) {
                    onDownloadOrigin();
                } else
                if ( action === 'check-orpho' ) {
                    onOrthographyCheck();
                } else
                if ( action === 'close-modal' ) {
                    closeModal();
                } else
                if ( action === 'coauth' ) {
                    closeModal();
                    mainContext.openOptions('coauth');
                } else
                if ( action === 'navigation' ) {
                    closeModal();
                    mainContext.openOptions('navigation');
                }
        });

        $$('.toggle').on('toggle:change', '[data-action=turn-mobile-view]', e => {
            onChangeMobileView();
            closeModal();
            mainContext.openOptions('snackbar');
        });
        $$('[data-action=rename]').on('click', changeTitleHandler);

        return () => {
        }
    }, []);

    const changeTitle = name => {
        const api = Common.EditorApi.get();
        const docInfo = storeDocumentInfo.docInfo;
        const docExt = storeDocumentInfo.dataDoc.fileType;
        const title = `${name}.${docExt}`;

        storeDocumentInfo.changeTitle(title);
        docInfo.put_Title(title);
        storeDocumentInfo.setDocInfo(docInfo);
        api.asc_setDocInfo(docInfo);
    };

    return (
        <SettingsContext.Provider value={{}}>
            <SettingsView />
        </SettingsContext.Provider>
    );
};

export default inject("storeAppOptions", "storeDocumentInfo")(observer(SettingsController));