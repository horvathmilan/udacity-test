'use strict';

class ProgramCatalog {

    constructor() {
        this.logo = element(by.css('.header__navbar--logo'));
        this.searchBar = element(by.css('.adjust-search input'));
        this.resultCounter = element(by.css('.result-count'));
        this.bannerCloseButton = element(by.css('.close-btn'));
        this.resultsLabel = element(by.css('.selected-filters'));
        this.emptyState = element(by.css('.empty-state'));

        this.cards = element.all(by.css('.card__inner'));
        this.allSelectedFiltersInTheField = element.all(by.css('.filters'));
        this.selectedItemWrapper = element.all(by.css('.selected-item-wrapper span'));
        this.filterOptions = element.all(by.css('.hidden-sm-down.mb-2 .multiselect-item-checkbox'));
        this.skillsCoveredSection = card => card.all(by.css('.skills .truncate-content span'));

        this.filterBox = text => element(by.cssContainingText('.multiselect-dropdown', text));
        this.filterOption = text => element(by.cssContainingText('.multiselect-item-checkbox', text));
        this.card = text => element(by.cssContainingText('ir-catlog-card div.card-wrapper', text));
        this.openedCourseTitle = text => element(by.cssContainingText('.hero__course--title', text));
        this.filters = text => element(by.cssContainingText('.selected-filters', text));

        this.courseLevelLogo = card => card.element(by.css('span > .course-level'));
        this.courseLevelText = card => card.element(by.css('.hidden-sm-down .capitalize'));
        this.checkBoxInput = filterOption => filterOption.element(by.css('input'));

        this.dropdownList = text => this.filterBox(text).element(by.css('.dropdown-list'));
        this.blueExpander = text => this.card(text).element(by.css('.blue.expander'));
        this.shortDescription = text => this.card(text).element(by.css('.card__expander--summary'));
        this.learnMoreButton = text => this.card(text).element(by.css('.button--primary'));
        this.filtersCloser = text => this.filters(text).element(by.css('img'));
        this.cardTitle = text => this.card(text).element(by.css('.card-heading a'));
        this.cardImage = text => this.card(text).element(by.css('.image_wrapper'));

        this.courseCount = null;
    }

    load() {
        browser.driver.manage().deleteAllCookies(); 
        browser.get('https://eu.udacity.com/courses/all');
        this.waitForLogo();
        this.bannerCloseButton.click();
        return browser.sleep(pageLoadTime);
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
        return browser.sleep(extraWait);
    }

    clearSearchBar() {
        this.searchBar.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
        return this.searchBar.sendKeys(protractor.Key.BACK_SPACE);
    }

    getAllSelectedFiltersText() {
        return this.allSelectedFiltersInTheField.getText();
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
        return browser.wait(() => {
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
        this.filterOption(text).click();
        return browser.sleep(extraWait);
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

    openShortDescription(text) {
        return this.isShortDescriptionVisible(text).then(visible => {
            if (!visible) {
                this.blueExpander(text).click();
                return this.waitForBlueExpander(text);
            }
        });
    }

    waitForBlueExpander(text) {
        return browser.wait(() => {
            return this.isShortDescriptionVisible(text);
        });
    }

    waitForOpenedCourseTitle(text) {
        return browser.wait(() => {
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
        return this.shortDescription(text).getText().then(elementText => {
            return !!elementText;
        });
    }

    isLearnMoreButtonVisible(text) {
        return this.learnMoreButton(text).isVisible();
    }

    clickOnCardTitle(text) {
        this.cardTitle(text).click();
        return this.waitForOpenedCourseTitle(text);
    }

    clickOnCardImage(text) {
        this.cardImage(text).click();
        return this.waitForOpenedCourseTitle(text);
    }

    clickOnCardLearnMoreButton(text) {
        this.openShortDescription(text);
        this.learnMoreButton(text).click();
        return this.waitForOpenedCourseTitle(text);
    }

    getOpenedCourseTitleText(text) {
        return this.openedCourseTitle(text).getText();
    }

    deleteFilter(text) {
        this.filtersCloser(text).click();
        return browser.sleep(extraWait);
    }

    isResultsLabelVisible() {
        return this.resultsLabel.isVisible();
    }

    getSelectedItemWrapper() {
        return this.selectedItemWrapper.getText();
    }

    isCheckboxSelected() {
        return this.filterOptions.filter((item) => {
            return this.checkBoxInput(item).isSelected();
        }).then(results => {
            return Promise.all(results.map(item => {
                return item.getText();
            }));
        });
    }

    isSkillsCoveredSectionContainsTheFilters(filters) { 
        return this.cards.then(cards => {
            return Promise.all(cards.map (card => {
                return this.skillsCoveredSection(card).getText();
            })).then(result => {
                return result.every(element => {
                    let array = deleteCommas(element);
                    for (let i=0; i<filters.length; i++){
                        if (array.indexOf(filters[i]) > -1){
                            return true;
                        }
                    }
                    return false;
                });
            });
        });
    }

    isEmptySearchTextVisible() {
        return this.emptyState.isVisible();
    }
}

module.exports = new ProgramCatalog();