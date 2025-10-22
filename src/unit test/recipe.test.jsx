import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent, within} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Recipe from '../recipe management/recipe.jsx'
import RecipeDetail from '../recipe management/recipeDetail.jsx';
import { getAllPantryItems, getRecipe } from '../../server/server.js';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ name: 'chocolate-flourless-cake'}),
        useNavigate: () => vi.fn(),
    }
})

describe('Testing Recipe Management Feature', () => {
    const mockRecipes = [
        { title: 'Elegant Apple Dumpling',
            servings: '4 servings',
            ingredients: 'Dough: | 1 cup All purpose flour | 1 teaspoon Cinnamon | 1/4 teaspoon Salt | 2 tablespoon Butter | 1 tablespoon Shortening | 1/4 cup Apple juice or apple cider | Filling: | 4 tablespoon Butter | 1/4 cup Brown sugar | 1/2 cup Crushed gingersnaps | 1/4 cup Ground pecans | 1 tablespoon Grand Mariner | 1 teaspoon Cinnamon',
            instructions: 'Mix flour, cinnamon, salt, butter and shortening until a crumbly mixture forms. Add in the juice slowly, until a smooth dough forms. Melt butter, and mix the rest of the ingredients into it. Putting it all together: Core 3/4 of an apple (preferably a Granny Smith) making sure that there is plenty of room for the filling. Roll out the dough, the thinner the better. Wrap dough around the apple. Squeeze off the excess and create leaves for the top of the apple with the extra. Bake at 350 degrees for approximately 20 minutes until dough becomes a light to golden brown. It will not get too dark so definitely keep checking on it. The dough recipe should yield enough for two apples. To make a stem for the apple use a small piece of cinnamon stick :'
        },
        { title: 'Chocolate Flourless Cake',
            servings: '12 servings',
            ingredients: '6 tablespoon Margarine 10 3/4 teaspoons Equal® Measure or 36 packets Equal® sweetener or 1 1/2 cups Equal® Spoonful | 4 oz Unsweetened chocolate | 1/3 cup Skim milk | 1/3 cup Apricot preserves with NutraSweet® brand sweetener or apricot spreadable fruit | 3 Egg whites | 1/8 teaspoon Cream of tartar | 1/4 cup All-purpose flour | 2 teaspoon Instant espresso coffee crystals | 1/8 teaspoon Salt | 1 Egg yolk | Rich Chocolate Glaze (optional; recipe follows) | 1 teaspoon Vanilla',
            instructions: 'Garnish with light whipped topping, chocolate drizzle and/or raspberries, if desired Heat margarine, chocolate, milk, apricot preserves, and espresso crystals in small saucepan whisking frequently, until chocolate is almost melted. Remove pan from heat; continue whisking until chocolate is melted and mixture is smooth Whisk in egg yolk and vanilla; add Equal®, whisking until smooth. Beat egg whites and cream of tartar to stiff peaks in large bowl. Fold chocolate mixture in egg whites; fold in combined flour and salt.Lightly grease bottom of 9-inch round cake pan and line with parchment or baking paper.Pour cake batter into pan. Bake in preheated 350ø F oven until cake is just firm when lightlytouched, 18 to 20 minutes and toothpick comes out clean (do not overbake). Carefullyloosen side of cake from pan with small sharp knife, which will keep cake from cracking as it cools. Cool cake completely in pan on wire rack; refrigerate until chilled, 1 to 2 hours.'
        }
    ];

    beforeEach(() => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve(mockRecipes),
            })
        );
    });

    //Checks to see whether there are a few recipes that are shown on the page
    it('Correctly show recipes on the webpage', async () => {
        
        render(
            <MemoryRouter>
                <Recipe />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Elegant Apple Dumpling')).toBeInTheDocument();
        })
    });

    //Checks if a warning message is present when recipes are provided
    it('Display warning message if no recipes are provided', async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        render(
            <MemoryRouter>
                <Recipe />
            </MemoryRouter>
        );

        const warningMessage = await screen.findByText(/No recipes found/i);
        expect(warningMessage).toBeInTheDocument();
    })

    //Checks whether the page is able to filter the list of recipes based on a user prompt
    it('Filters recipe based on search input', async () => {
        render(
            <MemoryRouter>
                <Recipe />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Chocolate Flourless Cake')).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, {target: {value: 'chocolate'} });

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Chocolate Flourless Cake')).toBeInTheDocument();
        });
    })

    //Checks whether users are able to successfully save recipes by checking for the success message
    it('Shows success message when recipe is saved', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: () => Promise.resolve(mockRecipes),
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ success: true}),
            });

            render(
                <MemoryRouter>
                    <Recipe />
                </MemoryRouter>
            );

            await screen.findByText('Chocolate Flourless Cake');
            const specificRecipe = screen.getByText('Chocolate Flourless Cake').closest('.mealTimes');
            const saveButton = within(specificRecipe).getByText('Save Recipe');
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(screen.getByText(/has been successfully added to saved recipes/i)).toBeInTheDocument();
            })
    })

    //Checks whether the webpage is able to successfully render the the details of the recipe such as ingredients and the instructions
    it('Viewing all the ingredients and instructions of a specific recipe', async () => {
        render(
            <MemoryRouter>
                <RecipeDetail />
            </MemoryRouter>
        );

        await screen.findByText('Elegant Apple Dumpling');

        expect(screen.getByText('1 cup All purpose flour'));
        expect(screen.getAllByText('1 teaspoon Cinnamon'));
        expect(screen.getByText('1/4 teaspoon Salt'));

        expect(screen.getByText('Mix flour, cinnamon, salt, butter and shortening until a crumbly mixture forms'));
        expect(screen.getByText('Add in the juice slowly, until a smooth dough forms'));
        expect(screen.getByText('Melt butter, and mix the rest of the ingredients into it'));

    })

    //Checks whether users are able to automatically add the ingredients to their shopping list by checking for a successfully added message
    it('Shows success message when Add To Shopping List is selected', async () => {

        render(
            <MemoryRouter>
                <RecipeDetail />
            </MemoryRouter>
        );

        await screen.findByText('Elegant Apple Dumpling');
        const button = await screen.getByText('Add To Shopping List');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/Ingredients been successfully added to shopping list/i)).toBeInTheDocument();
        })
    })
})