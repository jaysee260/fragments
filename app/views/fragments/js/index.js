(async function() {
    // TODO
    // Use localstorage to cache fragments returned
    // from server in order to speed up table re-rendering
    // time once a fragment is deleted. Set up cache to for
    // 10 or so minutes

    function getAllFragments() {
      let settings = {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      return fetch("/api/fragments", settings);
    }
    
    function populateTable(id, data, rowClass) {
      let tableBody = document.getElementById(id).tBodies[0];

      if (data.length == 0 ) {
          tableBody.innerText = "No fragments have been saved yet";
      } else {
          // Create a row for each fragment.
          // Then create a <td> for each field in the fragment.
          data.forEach((item, i) => {
            let tableRow = document.createElement("TR");
            tableRow.setAttribute("class", "fragment");
            tableRow.setAttribute("id", item._id);
            tableRow.dataset.rowNumber = i+1;
            delete item._id;
            
            let count = 0;
            let tableHeaders = document.getElementById("header-row").dataset.headers.split(",");
            while (count < tableHeaders.length) {
              let tableDataCell = document.createElement("TD");
              tableDataCell.setAttribute("id", count+1);
              if (tableHeaders[count] == "createdOn") {
                tableDataCell.innerText = item[tableHeaders[count]].date + " at " + item[tableHeaders[count]].time;
              } else {
                tableDataCell.innerText = item[tableHeaders[count]];
              }
              
              tableRow.appendChild(tableDataCell);
              count++;
            }
            let deleteRow = document.createElement("TD");
            let deleteButton = document.createElement("A");
            deleteButton.setAttribute("class", "delete");
            deleteButton.dataset.rowNumber = i+1;
            deleteRow.appendChild(deleteButton);
            tableRow.appendChild(deleteRow);
            tableBody.appendChild(tableRow);
          });
      }
      
    };

    function deleteFragment(_id) {
      // Configure settings and set headers for DELTE request.
      let settings = {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      // returns an unresolved Promise.
      return fetch("/api/fragments/" + _id, settings);
    }

    function clearTableBody(table_id) {
      let table = document.getElementById(table_id);
      let tbody = document.getElementsByTagName("tbody")[0];
      table.removeChild(tbody);
      table.appendChild(document.createElement("TBODY"));
    }

    async function initializeTable(table_id) {
      var fragments;
      try {
        let response = await getAllFragments();
        let data = await response.json();
        fragments = data.fragments;
      } catch (error) {
        console.log(error);
      }

      populateTable(table_id, fragments);
    }


    const table = document.getElementById("fragments-table");
    initializeTable(table.id);

    document.addEventListener("click", async function(e) {
      if (!e.target.classList.contains('delete')) return;
      
      let message = "Are you sure you want to delete this fragment?";
      if ( confirm(message) ) {
        let fragmentId = e.target.parentNode.parentNode.id;
        let response = await deleteFragment(fragmentId);

        if (response.ok && response.status == 200) {
          clearTableBody(table.id);
          initializeTable(table.id);
        } else {
          console.log(response);
        }
      }
      
    });

  })();