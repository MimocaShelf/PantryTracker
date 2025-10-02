import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Recipe() {
  const navigate = useNavigate();

  return (
    <div class="nutritionContainer">

      <div class="section">
        <h1>Recipe Page</h1>
        <p>See your list of recommended recipes based on items that is in your pantry.</p>
        <p>Click on 'view more' to see more information about the recipe including instructions and list of additional ingredients needed to complete the meal</p>
      </div>


    </div>
  )

}

export default Recipe;