function guestData() { /* this is a copy of board.html, starting from <div class="board"> */
return /*html*/`
<div class="board">
    <div class="to-do-section">
      <div class="instance">
        <h3>To do</h3>
        <div onclick="addTask()" class="plus-button">
          <img src="./img/Capa 1.svg" alt="" />
        </div>
      </div>

      <div class="containerDiv" id="renderCard"></div>

      <div id="todo-column" class="board-column-content" ondrop="moveTo('board-column-todo')"
        ondragover="allowDrop(event); highlight('board-column-todo')"
        ondragleave="removeHighlight('board-column-todo')">

        <div onclick="openCard()" class="card-user-story">
          <div class="user-story">
            <p class="to-do-top">User Story</p>
          </div>
          <div class="title-container">
            <p class="card-title">Contact Form & Imprint</p>
            <p class="card-content">
              Create a contact form and imprint page...
            </p>
          </div>
          <div class="progress">
            <div class="progress-bar"></div>
            <div class="subtasks">0/2 Subtasks</div>
          </div>
          <div class="to-do-bottom">
            <div class="initial-container">
              <div class="profile-badge">
                <img src="./img/Ellipse5-1.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-2.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-3.svg" alt="" />
              </div>
            </div>
            <div class="priority-symbol">
              <img src="./img/Prio_up.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="in-progress-section">
      <div class="instance">
        <h3>In progress</h3>
        <div onclick="addTask()" class="plus-button">
          <img src="./img/Capa 1.svg" alt="" />
        </div>
      </div>

      <div id="progress-column" class="board-column-content" ondrop="moveTo('board-column-progress')"
        ondragover="allowDrop(event); highlight('board-column-progress')"
        ondragleave="removeHighlight('board-column-progress')">

        <div onclick="openCard()" class="card-user-story-progress">
          <div class="user-story">
            <p class="in-progress-top">User Story</p>
          </div>
          <div class="title-container">
            <p class="card-title">Kochwelt Page & Recipe<br />Recommender</p>
            <p class="card-content">
              Build start page with recipe recommendation...
            </p>
          </div>
          <div class="progress">
            <div class="progress-bar">
              <div class="progress-fill-in-progress"></div>
            </div>
            <div class="subtasks">1/2 Subtasks</div>
          </div>
          <div class="to-do-bottom">
            <div class="initial-container">
              <div class="profile-badge">
                <img src="./img/Ellipse5-1.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-2.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-3.svg" alt="" />
              </div>
            </div>
            <div class="priority-symbol-neutral">
              <img src="./img/Prio_neutral-2.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="await-section">
      <div class="instance">
        <h3>Await feedback</h3>
        <div onclick="addTask()" class="plus-button">
          <img src="./img/Capa 1.svg" alt="" />
        </div>
      </div>

      <div id="await-column" class="board-column-content" ondrop="moveTo('board-column-await')"
        ondragover="allowDrop(event); highlight('board-column-await')"
        ondragleave="removeHighlight('board-column-await')">

        <div onclick="openCard()" class="card-await-feedback">
          <div class="technical-task">
            <p class="await-feedback-top">Technical Task</p>
          </div>
          <div class="title-container">
            <p class="card-title">HTML Base Template Creation</p>
            <p class="card-content">Create reusable HTML base templates...</p>
          </div>
          <div class="to-do-bottom">
            <div class="initial-container">
              <div class="profile-badge">
                <img src="./img/Ellipse5-1.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-2.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-3.svg" alt="" />
              </div>
            </div>
            <div class="priority-symbol-down">
              <img src="./img/Prio_down.svg" alt="" />
            </div>
          </div>
        </div>

        <div class="card-user-story-await">
          <div class="user-story">
            <p class="in-progress-top">User Story</p>
          </div>
          <div class="title-container">
            <p class="card-title">Daily Kochwelt Recipe</p>
            <p class="card-content">
              Implement daily recipe and portion calculator....
            </p>
          </div>
          <div class="to-do-bottom">
            <div class="initial-container">
              <div class="profile-badge">
                <img src="./img/Ellipse5-1.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-2.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-3.svg" alt="" />
              </div>
            </div>
            <div class="priority-symbol-neutral">
              <img src="./img/Prio_neutral-2.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="done-section">
      <div class="instance">
        <h3>Done</h3>
      </div>

      <div id="done-column" class="board-column-content" ondrop="moveTo('board-column-done')"
        ondragover="allowDrop(event); highlight('board-column-done')"
        ondragleave="removeHighlight('board-column-done')">

        <div class="card-done">
          <div class="technical-task">
            <p class="await-feedback-top">Technical Task</p>
          </div>
          <div class="title-container">
            <p class="card-title">CSS Architecture Planning</p>
            <p class="card-content">
              Define CSS naming conventions and structure...
            </p>
          </div>
          <div class="progress">
            <div class="progress-bar">
              <div class="progress-fill-in-progress-done"></div>
            </div>
            <div class="subtasks">2/2 Subtasks</div>
          </div>
          <div class="to-do-bottom">
            <div class="initial-container">
              <div class="profile-badge">
                <img src="./img/Ellipse5-1.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-2.svg" alt="" />
              </div>
              <div class="profile-badge">
                <img src="./img/Ellipse5-3.svg" alt="" />
              </div>
            </div>
            <div class="priority-symbol">
              <img src="./img/Prio_up.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
}