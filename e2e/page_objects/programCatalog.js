'use strict';

class ProgramCatalog {

    constructor() {
        this.logo = element(by.css('.header__navbar--logo'));
        this.searchBar = element(by.css('.adjust-search input'));
        this.resultCounter = element(by.css('.result-count'));
        this.bannerCloseButton = element(by.css('.close-btn'));

        this.cards = element.all(by.css('.card__inner'));
        this.selectedFiltersField = element.all(by.css('.filters'));

        this.filterBox = text => element(by.cssContainingText('.multiselect-dropdown', text));
        this.filterOption = text => element(by.cssContainingText('.multiselect-item-checkbox', text));
        this.findCard = text => element(by.cssContainingText('ir-catlog-card div.card-wrapper', text));
        this.findCardTitle = text => element(by.cssContainingText('.card-heading a', text));
        this.openedCourseTitle = text => element(by.cssContainingText('.hero__course--title', text));
        this.filters = text => element(by.cssContainingText('.filters', text));

        this.courseLevelLogo = card => card.element(by.css('span > .course-level'));
        this.courseLevelText = card => card.element(by.css('.hidden-sm-down .capitalize'));
        this.dropdownList = text => this.filterBox(text).element(by.css('.dropdown-list'));
        this.blueExpander = text => this.findCard(text).element(by.css('.blue.expander'));
        this.shortDescription = text => this.findCard(text).element(by.css('.card__expander--summary'));
        this.shortDescriptionText = text => this.findCard(text).element(by.css('.card__expander--summary span'));
        this.learnMoreButton = text => this.findCard(text).element(by.css('.button--primary'));
        this.filtersCloser = text => this.filters(text).element(by.css('img'));

        this.courseCount = null;
    }

    load() {
        browser.get('https://eu.udacity.com/courses/all');
        this.waitForLogo();
        this.bannerCloseButton.click();
        return browser.sleep(5000);
    }

    isLogoVisible() {
        return this.logo.isVisible();
    }

    waitForLogo() {
        return browser.wait(() => {
            return this.isLogoVisible();
        });
    }

    isSearchBarVisible() {
        return this.searchBar.isVisible();
    }

    countCourses() {
        return this.cards.count();
    }

    getPlaceholderText() {
        return this.searchBar.getAttribute('placeholder');
    }

    typeIntoSearchBar(text) {
        this.searchBar.sendKeys(text);
        return browser.sleep(3000);
    }

    clearSearchBar() {
        this.searchBar.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
        return this.searchBar.sendKeys(protractor.Key.BACK_SPACE);
    }

    selectedFilters() {
        return this.selectedFiltersField.getText();
    }

    getResultCounter() {
        return this.resultCounter.getText().then(text => {
            let regex = /Results? \((\d+)\)/;
            let token = text.match(regex);
            return +token[1];
        });
    }

    isDropdownFilterVisible(text) {
        return this.dropdownList(text).isVisible();
    }

    waitForDropdownList(text) {
        browser.wait(() => {
            return this.isDropdownFilterVisible(text);
        });
    }

    openFilterDropdown(text) {
        return this.isDropdownFilterVisible(text).then(visible => {
            if (!visible) {
                this.filterBox(text).click();
                return this.waitForDropdownList(text);
            }
        });
    }

    clickOnFilter(text) {
        return this.filterOption(text).click();
    }

    areCourseLevelLogosCorrect(level) {
        return this.cards.then(cards => {
            return Promise.all(cards.map(card => {
                return this.courseLevelLogo(card).getAttribute('class');
            })).then(results => {
                return results.every(result => {
                    return result.indexOf(level) > -1;
                });
            });
        });
    }

    isCorrectCourseLevelTextVisible(level) {
        return this.cards.then(cards => {
            return Promise.all(cards.map(card => {
                return this.courseLevelText(card).getText();
            })).then(results => {
                return results.every(result => {
                    return result === level;
                });
            });
        });
    }

    clickOnTheExpander(text) {
        return this.isShortDescriptionVisible(text).then(visible => {
            if (!visible) {
                this.blueExpander(text).click();
                return this.waitForBlueExpander(text);
            }
        });
    }

    waitForBlueExpander(text) {
        browser.wait(() => {
            return this.isShortDescriptionVisible(text);
        });
    }

    waitForOpenedCourseTitle(text) {
        browser.wait(() => {
            return this.isOpenedCourseTitleVisible(text);
        });
    }

    isOpenedCourseTitleVisible(text) {
        return this.openedCourseTitle(text).isVisible();
    }

    isShortDescriptionVisible(text) {
        return this.shortDescription(text).isVisible();
    }

    isShortDescriptionNotEmpty(text) {
        return this.shortDescriptionText(text).getText().then(elementText => {
            return elementText.length > 0;
        });
    }

    isLearnMoreButtonVisible(text) {
        return this.learnMoreButton(text).isVisible();
    }

    clickOnCardTitle(text) {
        this.findCardTitle(text).click();
        return browser.sleep(3000);
    }

    getOpenedCourseTitleText(text) {
        this.waitForOpenedCourseTitle(text);
        return this.openedCourseTitle(text).getText();
    }

    clickOnFilterCloser(text) {
        return this.filtersCloser(text).click();
    }

    isResultsLabelVisible() {
        return this.resultCounter.isVisible();
    }
}

module.exports = new ProgramCatalog();