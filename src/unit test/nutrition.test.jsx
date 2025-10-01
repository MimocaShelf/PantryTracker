import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NutritionLogic from '../nutrition management/nutritionLogic.jsx';
import { getAllPantryItems, getRecipe } from '../../server/server.js';

describe('Testing Nutrition Management Feature', () => {

    //Unit test to determine if the view provideds suitable feedback to users when there are no pantry items
    it('Correctly show message when no pantry items', async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        render(
            <MemoryRouter><NutritionLogic /></MemoryRouter>
        );

        const message = await screen.findByText(/No nutrition data available/i);
        expect(message).toBeInTheDocument();
    })

    //Unit test to see whether view depicts the nutrition information when server returns list of pantry items and its values
    it('Display pantry items and nutrition items when data', async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve([{ itemName: 'tomato', calories: 18.2, protein: 0.9, carbohydrate: 3.9, fats: 0.2 }])
            })
        );

        render(
            <MemoryRouter><NutritionLogic /></MemoryRouter>
        );

        expect(await screen.findByText(/tomato/i)).toBeInTheDocument();
        expect(await screen.findByText(/18.2/i)).toBeInTheDocument();
        expect(await screen.findByText(/0.9/i)).toBeInTheDocument();
        expect(await screen.findByText(/3.9/i)).toBeInTheDocument();
        expect(await screen.findByText(/0.2/i)).toBeInTheDocument();

    })

    //Unit test to check if Recipe API is succesfully called
    it('Check if nutrition API was succesfully called', async () => {
        const mockQuery = 'tomato onion';
        const encodedQuery = encodeURIComponent('tomato onion');

        global.fetch = vi.fn( () => 
            Promise.resolved({
                ok: true,
                json: () => Promise.resolve([])
            })
        );

        await getAllPantryItems(mockQuery);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(`https://api.calorieninjas.com/v1/nutrition?query=${encodedQuery}`, 
            expect.objectContaining({
                headers: expect.objectContaining({
                    'X-Api-Key': expect.any(String)
                })
            })
        );
    })

    //Unit test to check if the nutrition results is formatted properly to be passed to view successfully
    it('Format nutrition API results appropriately', async () => {
        const temporaryResponse = {
            items: [
                {            
                    name: 'tomato',
                    calories: 18.2,
                    protein_g: 0.9,
                    carbohydrates_total_g: 3.9,
                    fat_total_g: 0.2
                }
            ]
        }

        global.fetch = vi.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve(temporaryResponse)
            })
        );

        const result = await getAllPantryItems('tomato');
        expect(result).toEqual([{
            itemName: 'Tomato',
            calories: 18.2,
            protein: 0.9,
            carbohydrate: 3.9,
            fats: 0.2
        }])
    })

    //Unit test to check if Recipe API is succesfully called
    it('Check if recipe API was succesfully called', async () => {
        const mockRows = [{ item_name: 'tomato'}, {item_name: 'onion'}];
        const encodedQuery = encodeURIComponent('tomato onion');

        global.fetch = vi.fn( () => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );

        await getRecipe(mockRows);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(`https://api.api-ninjas.com/v1/recipe?query=${encodedQuery}`, 
            expect.objectContaining({
                headers: expect.objectContaining({
                    'X-Api-Key': expect.any(String)
                })
            })
        );
    })

    //Unit test to check if the recipe results is formatted properly to be passed to view successfully
    it('Format recipe API results appropriately', async () => {
        const mockPantryItemRows = [{ item_name: 'tomato'}, {item_name: 'onion'}];
        const mockAPIResponse = [
            {
                title: "Tomato Onion Chutney",
                ingredients: "1 1/2 lb Italian Roma tomatoes; seeded and quartered|2 c Large-diced onions|1/4 c Sugar|2 tb Finely-minced ginger|1/3 c Tarragon-flavored white wine vinegar|1/4 ts Red chile flakes; or to taste|1/4 c Cumin seeds|1 1/2 ts Mustard seeds|12 Cardamom seeds from 3 or 4 pods; optional|1/2 ts Salt",
                servings: "1 servings",
                instructions: "Gently toss the tomatoes, onions, sugar and ginger together in a saucepan and allow to sit for 2 to 3 hours. Stir in the vinegar, chile, cumin seed, coriander seed, mustard seed, cardamom and salt and simmer partially covered for 10 minutes. Stir occasionally. Strain mixture, set solids aside, and return liquid to pan and reduce over high heat until syrupy. Pour over tomato mixture. Stir gently, cool and store covered in refrigerate for up to one week. This recipe yields approximately 2 cups of chutney. Variation: One cup fresh corn kernels can be added during last 2 minutes of cooking."
            }
        ];

        global.fetch = vi.fn( () => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockAPIResponse)
            })
        );

        global.convertMeasurementAcronymToWords = vi.fn(async (text) => 
            text.replace('c', 'cup').replace('tb', 'tablespoon').replace('ts', 'teaspoon').replace('|', ' | ')
        );

        const result = await getRecipe(mockPantryItemRows);
        expect(result).toEqual([
            {
                title: "Tomato Onion Chutney",
                ingredients: "1 1/2 lb Italian Roma tomatoes; seeded and quartered | 2 cup Large-diced onions | 1/4 cup Sugar | 2 tablespoon Finely-minced ginger | 1/3 cup Tarragon-flavored white wine vinegar | 1/4 teaspoon Red chile flakes; or to taste | 1/4 cup Cumin seeds | 1 1/2 teaspoon Mustard seeds | 12 Cardamom seeds from 3 or 4 pods; optional | 1/2 teaspoon Salt",
                servings: "1 servings",
                instructions: "Gently toss the tomatoes, onions, sugar and ginger together in a saucepan and allow to sit for 2 to 3 hours. Stir in the vinegar, chile, cumin seed, coriander seed, mustard seed, cardamom and salt and simmer partially covered for 10 minutes. Stir occasionally. Strain mixture, set solids aside, and return liquid to pan and reduce over high heat until syrupy. Pour over tomato mixture. Stir gently, cool and store covered in refrigerate for up to one week. This recipe yields approximately 2 cups of chutney. Variation: One cup fresh corn kernels can be added during last 2 minutes of cooking."
            }
        ])

    })
})