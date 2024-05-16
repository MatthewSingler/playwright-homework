import { test, expect } from '@playwright/test';

test.beforeEach(async({page}) => {
    await page.goto('https://petclinic.bondaracademy.com/welcome')
})

test.describe('Pet types', () => {
    test.beforeEach(async({page}) => {
        await page.getByRole('link', {name: "Pet Types"}).click() //1. Select Pet Types menu
    })

    test('Update pet type', async({page}) => {
        const petTypesTableName = page.getByRole('heading', {name: "Pet Types"})
        await expect(petTypesTableName).toHaveText('Pet Types')  //2. assertion of Pet Types text displayed

        await page.getByRole('button', {name: "Edit"}).first().click()  //3. click on edit button for cat
        await expect(page.getByRole('heading', {name: "Edit Pet Type"})).toBeVisible() //4. assertion of Edit Pet Type header

        const petTypeName = page.locator('#name')
        await petTypeName.click()
        await petTypeName.clear()
        await petTypeName.fill('rabbit') //5. change pet name to rabbit and click update
        const updatedPetTypeNameValue = await petTypeName.inputValue()
        expect(updatedPetTypeNameValue).toEqual('rabbit')
        const updateButton = page.getByRole('button', {name: "Update"})
        await updateButton.click() //5. click update

        //await expect(petTypesTableName).toBeVisible()
        //await expect(page.getByRole('row', {}))

        //expect(updatedPetTypeNameValue).toContain //6. assertion for first pet in list is rabbit

        await page.getByRole('button', {name: "Edit"}).first().click() //7. click edit button for rabbit
        await expect(page.getByRole('heading', {name: "Edit Pet Type"})).toBeVisible()
        await petTypeName.click()
        await petTypeName.clear()
        await petTypeName.fill('cat') //8. change name to cat and update
        //await expect(updatedPetTypeNameValue).
        await updateButton.click()
        //await expect(petTypeName.locator('td input').nth(0)).toHaveText('cat') //9. assertion that first pet in list is cat
        
    })
})