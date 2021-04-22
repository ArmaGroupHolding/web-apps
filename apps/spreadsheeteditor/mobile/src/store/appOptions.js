import {action, observable, makeObservable} from 'mobx';

export class storeAppOptions {
    constructor() {
        makeObservable(this, {
            isEdit: observable,
            canViewComments: observable,
            setConfigOptions: action,
            setPermissionOptions: action
        });
    }

    isEdit = false;
    config = {};
    canViewComments = false;

    setConfigOptions (config) {
        this.config = config;
        this.user = Common.Utils.fillUserInfo(config.user, config.lang, "Local.User"/*me.textAnonymous*/);
        this.isDesktopApp = config.targetApp == 'desktop';
        this.canCreateNew = !!config.createUrl && !this.isDesktopApp;
        this.canOpenRecent = config.recent !== undefined && !this.isDesktopApp;
        this.templates = config.templates;
        this.recent = config.recent;
        this.createUrl = config.createUrl;
        this.lang = config.lang;
        this.location = (typeof (config.location) == 'string') ? config.location.toLowerCase() : '';
        this.region = (typeof (config.region) == 'string') ? config.region.toLowerCase() : config.region;
        this.sharingSettingsUrl = config.sharingSettingsUrl;
        this.fileChoiceUrl = config.fileChoiceUrl;
        this.isEditDiagram = config.mode == 'editdiagram';
        this.isEditMailMerge = config.mode == 'editmerge';
        this.mergeFolderUrl = config.mergeFolderUrl;
        this.canAnalytics = false;
        this.canRequestClose = config.canRequestClose;
        this.customization = config.customization;
        this.canBackToFolder = (config.canBackToFolder!==false) && (typeof (config.customization) == 'object') && (typeof (config.customization.goback) == 'object')
            && (!!(config.customization.goback.url) || config.customization.goback.requestClose && this.canRequestClose);
        this.canBack = this.canBackToFolder === true;
        this.canPlugins = false;
    }

    setPermissionOptions (document, licType, params, permissions) {
        permissions.edit = params.asc_getRights() !== Asc.c_oRights.Edit ? false : true;
        this.canAutosave = true;
        this.canAnalytics = params.asc_getIsAnalyticsEnable();
        this.canLicense = (licType === Asc.c_oLicenseResult.Success || licType === Asc.c_oLicenseResult.SuccessLimit);
        this.isLightVersion = params.asc_getIsLight();
        this.canCoAuthoring = !this.isLightVersion;
        this.isOffline = Common.EditorApi.get().asc_isOffline();
        this.canRequestEditRights = this.config.canRequestEditRights;
        this.canEdit = permissions.edit !== false  && // can edit or review
            (this.config.canRequestEditRights || this.config.mode !== 'view') && true; // if mode=="view" -> canRequestEditRights must be defined
            // (!this.isReviewOnly || this.canLicense) && // if isReviewOnly==true -> canLicense must be true
            // true /*isSupportEditFeature*/;
        this.isEdit = (this.canLicense || this.isEditDiagram || this.isEditMailMerge) && permissions.edit !== false && this.config.mode !== 'view' && true;
        this.canComments = this.canLicense && (permissions.comment === undefined ? this.isEdit : permissions.comment) && (this.config.mode !== 'view');
        this.canComments = this.canComments && !((typeof (this.customization) == 'object') && this.customization.comments===false);
        this.canViewComments = this.canComments || !((typeof (this.customization) == 'object') && this.customization.comments===false);
        this.canEditComments = this.isOffline || !(typeof (this.customization) == 'object' && this.customization.commentAuthorOnly);
        this.canChat = this.canLicense && !this.isOffline && !((typeof (this.customization) == 'object') && this.customization.chat === false);
        this.canPrint = (permissions.print !== false);
        this.isRestrictedEdit = !this.isEdit && this.canComments;
        this.trialMode = params.asc_getLicenseMode();
        this.canDownloadOrigin = permissions.download !== false;
        this.canDownload = permissions.download !== false;
        this.canBranding = params.asc_getCustomization();
        this.canBrandingExt = params.asc_getCanBranding() && (typeof this.customization == 'object');
        this.canUseReviewPermissions = this.canLicense && this.customization && this.customization.reviewPermissions && (typeof (this.customization.reviewPermissions) == 'object');
    }
}