'use strict';

const {
    defineSupportCode
} = require('cucumber');
const ProgramCatalog = require('../page_objects/programCatalog');

defineSupportCode(({
    Given,
    When,
    Then,
    setDefaultTimeout
}) => {
    setDefaultTimeout(GLOBAL_TIMEOUT);

    Given(/^the Udacity course page is opened$/, () => {
        return ProgramCatalog.load();
    });

    When(/^the course count is remembered$/, () => {
        return ProgramCatalog.countCourses().then(count => {
            ProgramCatalog.courseCount = count;
        });
    });

    When(/^the search bar is cleared$/, () => {
        ProgramCatalog.clearSearchBar();
        return browser.sleep(pageLoadTime);
    });

    When(/^the "([^"].*)" dropdown is clicked$/, text => {
        return ProgramCatalog.openFilterDropdown(text);
    });

    When(/^the X button is clicked for the "([^"].*)" filter$/, text => {
        return ProgramCatalog.deleteFilter(text);
    });

    When(/^the text "([^"].*)" is typed into the search bar$/, text => {
        return ProgramCatalog.typeIntoSearchBar(text);
    });

    When(/^the "([^"].*)" skill (?:level )?is selected$/, text => {
        return ProgramCatalog.clickOnFilter(text);
    });

    When(/^the "([^"].*)" card's (title|image|LEARN MORE button) is clicked$/, (text, click) => {
        switch(click) {
            case "title": 
                return ProgramCatalog.clickOnCardTitle(text);
            case "image":
                return ProgramCatalog.clickOnCardImage(text);
            case "LEARN MORE button":
                return ProgramCatalog.clickOnCardLearnMoreButton(text);
        }
    });

    Then(/^the Udacity logo should be (visible|hidden)$/, visibility => {
        return expect(ProgramCatalog.isLogoVisible()).to.eventually.equal(visibility === 'visible');
    });

    Then(/^the search bar should be (visible|hidden)$/, visibility => {
        return expect(ProgramCatalog.isSearchBarVisible()).to.eventually.equal(visibility === 'visible');
    });

    Then(/^the placeholder text should be "([^"].*)"$/, text => {
        return expect(ProgramCatalog.getPlaceholderText()).to.eventually.equal(text);
    });

    Then(/^the course count should (be less than|equal to) the remembered course count$/, condition => {
        switch (condition) {
            case "be less than":
                return expect(ProgramCatalog.countCourses()).to.be.eventually.at.most(ProgramCatalog.courseCount);
            case "equal to":
                return expect(ProgramCatalog.countCourses()).to.eventually.equal(ProgramCatalog.courseCount);
        }
    });

    Then(/^the course count should equal to the result counter$/, () => {
        return ProgramCatalog.countCourses().then(courseCount => {
            return expect(ProgramCatalog.getResultCounter()).to.eventually.equal(courseCount);
        });
    });

    Then(/^the ([^"].*) course level logo should be visible for all cards$/, text => {
        return expect(ProgramCatalog.areCourseLevelLogosCorrect(text.toLowerCase())).to.eventually.be.true;
    });

    Then(/^the ([^"].*) course level label should be visible for all cards$/, level => {
        return expect(ProgramCatalog.isCorrectCourseLevelTextVisible(level)).to.eventually.be.true;
    });

    Then(/^the "([^"].*)" card's details expander is opened$/, text => {
        return ProgramCatalog.openShortDescription(text);
    });

    Then(/^the "([^"].*)" card's short description should be (visible|hidden)$/, (text, visibility) => {
        return expect(ProgramCatalog.isShortDescriptionVisible(text)).to.eventually.equal(visibility === "visible");
    });

    Then(/^the "([^"].*)" card's short description should not be an empty string$/, text => {
        return expect(ProgramCatalog.isShortDescriptionNotEmpty(text)).to.eventually.be.true;
    });

    Then(/^the "([^"].*)" card's 'LEARN MORE' button should be (visible|hidden)$/, (text, visibility) => {
        return expect(ProgramCatalog.isLearnMoreButtonVisible(text)).to.eventually.equal(visibility === "visible");
    });
    
    Then(/^the opened page's title should be "([^"].*)"$/, text => {
        return expect(ProgramCatalog.getOpenedCourseTitleText(text)).to.eventually.equal(text);
    });

    Then(/^the "Results" label should not be visible$/, () => {
        return expect(ProgramCatalog.isResultsLabelVisible()).to.eventually.be.false;
    });

    Then(/^the selected filters field should contain the following filters:$/, filters => {
        let filterArray = convertDataTable(filters);
        return expect(ProgramCatalog.getAllSelectedFiltersText()).to.eventually.eql(filterArray);
    });

    Then(/^the dropdown title should contain the following filters:$/, filters => {
        let filterArray = convertDataTable(filters);
        return expect(ProgramCatalog.getSelectedItemWrapper()).to.eventually.eql(filterArray);
    });

    Then(/^the checkboxes in the dropdown should be checked at the following filters:$/, filters => {
        let filterArray = convertDataTable(filters);
        return expect(ProgramCatalog.isCheckboxSelected()).to.eventually.eql(filterArray);
    });

    Then(/^the cards "Skills Covered" section should contain one of the following filters:$/, filters => {
        let filterArray = convertDataTable(filters);
        return expect(ProgramCatalog.isSkillsCoveredSectionContainsTheFilters(filterArray)).to.eventually.be.true;
    });

    Then(/^the warning message should be (visible|hidden)$/, visibility => {
        return expect(ProgramCatalog.isEmptySearchTextVisible()).to.eventually.equal(visibility === "visible");
    });
});