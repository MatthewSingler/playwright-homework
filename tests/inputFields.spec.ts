import { test, expect } from '@playwright/test';

test.beforeEach(async({page}) => {
    await page.goto('https://petclinic.bondaracademy.com/welcome')
})

test.describe('Pet types', () => {
    test.beforeEach(async({page}) => {
        await page.getByRole('link', {name: "Pet Types"}).click() //1. Select Pet Types menu
    })

    test('Update pet type', async({page}) => {
        const petTypesTableName = page.locator('app-pettype-list h2')
        await expect(petTypesTableName).toHaveText('Pet Types')  //2. assertion of Pet Types text displayed
        await page.getByRole('button', {name: "Edit"}).nth(0).click() //3. click on edit button for cat
        await expect(page.getByRole('heading', {name: "Edit Pet Type"})).toBeVisible() //4. assertion of Edit Pet Type header

        const editPetTypeNameInputField = page.locator('#name')
        await editPetTypeNameInputField.click()
        await editPetTypeNameInputField.clear()
        await editPetTypeNameInputField.fill('rabbit') //5. change pet name to rabbit and click update
        await expect(editPetTypeNameInputField).toHaveValue('rabbit')
        const updateButton = page.getByRole('button', {name: "Update"})
        await updateButton.click()

        const petTypesListName = page.locator('tr input').nth(0)
        await expect(petTypesListName).toHaveValue('rabbit') //6. assertion for first pet in list is rabbit
        await page.getByRole('button', {name: "Edit"}).nth(0).click() //7. click edit button for rabbit
        await expect(page.getByRole('heading', {name: "Edit Pet Type"})).toBeVisible()
        await editPetTypeNameInputField.click()
        await editPetTypeNameInputField.clear()
        await editPetTypeNameInputField.fill('cat') //8. change name to cat and update
        await updateButton.click()
        await expect(petTypesListName).toHaveValue('cat') //9. assertion that first pet in list is cat
        
    })

    test('Cancel pet type update', async ({page}) => {
        const petTypesTableName = page.locator('app-pettype-list h2')
        await expect(petTypesTableName).toHaveText('Pet Types')  //2. assertion of Pet Types text displayed
        await page.getByRole('button', {name: "Edit"}).nth(1).click() //3. click on edit button for dog
        const editPetTypeNameInputField = page.locator('#name') //4. type new name moose
        await editPetTypeNameInputField.click()
        await editPetTypeNameInputField.clear()
        await editPetTypeNameInputField.fill('moose')

        await expect(editPetTypeNameInputField).toHaveValue('moose') //5. Assertion for moose displayed on edit page

        await page.getByRole('button', {name: "Cancel"}).click() //6. click cancel button

        const petTypesListName = page.locator('tr input').nth(1)
        await expect(petTypesListName).toHaveValue('dog') //7. assertion that dog is still displayed in the list of pet types
    })

    test('Pet type name validation', async ({page}) => {
        const petTypesTableName = page.locator('app-pettype-list h2')
        await expect(petTypesTableName).toHaveText('Pet Types')  //2. assertion of Pet Types text displayed
        await page.getByRole('button', {name: "Edit"}).nth(2).click() //3. click on edit button for lizard
        const editPetTypeNameInputField = page.locator('#name') //4. clear input field
        await editPetTypeNameInputField.click()
        await editPetTypeNameInputField.clear()
        await expect(page.locator('div .help-block')).toHaveText('Name is required') //5. Assertion for 'name is required' message
        const updateButton = page.getByRole('button', {name: "Update"}) //6. click update button
        await updateButton.click()

        await expect(page.getByRole('heading', {name: "Edit Pet Type"})).toBeVisible() //7. assertion of Edit Pet Type page displayed
        await page.getByRole('button', {name: "Cancel"}).click() //8. click cancel button
        await expect(petTypesTableName).toHaveText('Pet Types')  //9. assertion of Pet Types text displayed
    })
})