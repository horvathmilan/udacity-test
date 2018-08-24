@current
Feature: Browsing the Udacity program catalog
  As a user
  I want to search in the Udacity program catalog
  so that I can choose the proper course

  Scenario: 1. The user should be able to use the search bar
    Given the Udacity course page is opened
    Then the Udacity logo should be visible
    And the search bar should be visible
    And the placeholder text should be "Search"

    When the course count is remembered
    And the text "android" is typed into the search bar
    Then the course count should be less than the remembered course count

    When the search bar is cleared
    Then the course count should equal to the remembered course count

  Scenario: 2. The card details and the filter fields should work correctly
    Given the Udacity course page is opened

    When the course count is remembered
    And the text "javascript" is typed into the search bar
    Then the selected filters field should contain the following filters:
      | javascript |
    And the course count should equal to the result counter

    When the X button is clicked for the "javascript" filter
    Then the "Results" label should not be visible
    And the course count should equal to the remembered course count

  Scenario Outline: 3. The card details, dropdown filter and filter fields should work correctly
    Given the Udacity course page is opened

    When the "Select Program Details" dropdown is clicked
    And the "<level>" skill level is selected
    Then the selected filters field should contain the following filters:
      | <level> |
    And the <level> course level logo should be visible for all cards
    And the <level> course level label should be visible for all cards
    Examples:
      | level        |
      | Beginner     |
      | Intermediate |
      | Advanced     |

  Scenario: 4. The LEARN MORE button and short description should be visible
    Given the Udacity course page is opened

    When the text "android" is typed into the search bar
    And the "Android Basics by Google" card's details expander is opened
    Then the "Android Basics by Google" card's short description should be visible
    And the "Android Basics by Google" card's short description should not be an empty string
    And the "Android Basics by Google" card's 'LEARN MORE' button should be visible

  Scenario Outline: 5. Alternative course page opening should work correctly
    Given the Udacity course page is opened

    When the text "javascript" is typed into the search bar
    And <step>
    Then the opened page's title should be "Intro to JavaScript"
    Examples:
      | step                                                          |
      | the "Intro to JavaScript" card's title is clicked             |
      | the "Intro to JavaScript" card's image is clicked             |
      | the "Intro to JavaScript" card's LEARN MORE button is clicked |

  Scenario: 6. Inspect the filters and the Skills Covered section
    Given the Udacity course page is opened

    When the "Industry Skills" dropdown is clicked
    And the "Android Development" skill is selected
    And the "C++" skill is selected
    And the "CSS" skill is selected
    Then the selected filters field should contain the following filters:
      | Android Development |
      | C++                 |
      | CSS                 |
    And the dropdown title should contain the following filters:
      | Android Development |
      | C++                 |
      | CSS                 |
    And the checkboxes in the dropdown should be checked at the following filters:
      | Android Development |
      | C++                 |
      | CSS                 |
    And the cards "Skills Covered" section should contain one of the following filters:
      | Android Development |
      | C++                 |
      | CSS                 |

  Scenario: 7. The search result list should be empty with a meaningless text in the search bar
    Given the Udacity course page is opened

    When the text "asdasd" is typed into the search bar
    Then the course count should equal to the result counter
    And the warning message should be visible
    And the selected filters field should contain the following filters:
      | asdasd |