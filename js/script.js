const form = document.getElementById('todo-form'); // Mengambil elemen form dari HTML
const taskInput = document.getElementById('task'); // Mengambil elemen input tugas
const dateInput = document.getElementById('date'); // Mengambil elemen input tanggal
const todoList = document.getElementById('todo-list'); // Mengambil elemen daftar tugas
const filterSelect = document.getElementById('filter-select'); // Mengambil elemen filter
const noTasksMessage = document.getElementById('no-tasks'); // Mengambil elemen pesan tidak ada tugas
const deleteAllButton = document.getElementById('delete-all'); // Mengambil tombol hapus semua
const notification = document.createElement('div'); // Membuat elemen div untuk notifikasi
notification.className = 'notification'; // Menambahkan kelas untuk notifikasi
document.body.appendChild(notification); // Menambahkan notifikasi ke body HTML

let todos = []; // Array untuk menyimpan daftar tugas
let editingTodoId = null; // Menyimpan ID tugas yang sedang diedit

form.addEventListener('submit', function (e) { // Menangani pengiriman form
  e.preventDefault(); // Mencegah pengiriman form default
  const task = taskInput.value.trim(); // Mengambil dan membersihkan input tugas
  const date = dateInput.value; // Mengambil input tanggal

  if (task === '' || date === '') { // Memeriksa apakah input kosong
    alert('Please fill in both fields!'); // Menampilkan peringatan
    return; // Menghentikan eksekusi jika ada input kosong
  }

  if (editingTodoId) { // Jika sedang mengedit tugas
    const todoIndex = todos.findIndex(todo => todo.id === editingTodoId); // Mencari index tugas
    todos[todoIndex].task = task; // Memperbarui tugas
    todos[todoIndex].date = date; // Memperbarui tanggal
    editingTodoId = null; // Mengatur kembali ID pengeditan
    showNotification('Task updated successfully!'); // Menampilkan notifikasi
  } else { // Jika menambah tugas baru
    const newTodo = { // Membuat objek tugas baru
      id: Date.now(), // Menggunakan timestamp sebagai ID
      task,
      date,
      completed: false // Menandai tugas sebagai belum selesai
    };
    todos.push(newTodo); // Menambahkan tugas baru ke array
    showNotification('Task added successfully!'); // Menampilkan notifikasi
  }

  renderTodos(todos); // Menampilkan daftar tugas
  form.reset(); // Mengatur ulang form
});

function showNotification(message) { // Fungsi untuk menampilkan notifikasi
  notification.textContent = message; // Mengatur teks notifikasi
  notification.style.display = 'block'; // Menampilkan notifikasi
  notification.style.opacity = 1; // Mengatur opasitas untuk efek tampilan

  setTimeout(() => { // Menghapus notifikasi setelah beberapa detik
    notification.style.opacity = 0; // Mengurangi opasitas
    setTimeout(() => {
      notification.style.display = 'none'; // Menyembunyikan notifikasi
    }, 500);
  }, 2000);
}

function renderTodos(todoArray) { // Fungsi untuk menampilkan daftar tugas
  todoList.innerHTML = ''; // Menghapus isi daftar
  noTasksMessage.style.display = todoArray.length === 0 ? 'block' : 'none'; // Menampilkan pesan jika tidak ada tugas

  todoArray.forEach(todo => { // Mengiterasi setiap tugas
    const tr = document.createElement('tr'); // Membuat elemen baris tabel

    const taskCell = document.createElement('td'); // Membuat sel untuk tugas
    taskCell.textContent = todo.task; // Mengatur teks sel

    const dateCell = document.createElement('td'); // Membuat sel untuk tanggal
    dateCell.textContent = todo.date; // Mengatur teks sel

    const statusCell = document.createElement('td'); // Membuat sel untuk status
    statusCell.textContent = todo.completed ? 'Completed' : 'Pending'; // Menampilkan status tugas
    statusCell.className = todo.completed ? 'completed' : 'pending'; // Menambahkan kelas untuk warna

    const actionsCell = document.createElement('td'); // Membuat sel untuk tindakan
    const actions = document.createElement('div'); // Membuat div untuk tombol aksi
    actions.classList.add('todo-actions'); // Menambahkan kelas

    // Tombol edit
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️'; // Mengatur ikon edit
    editBtn.addEventListener('click', () => editTodo(todo.id)); // Menangani klik tombol edit

    // Tombol hapus
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️'; // Mengatur ikon hapus
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this task?')) { // Konfirmasi sebelum menghapus
        deleteTodo(todo.id); // Menghapus tugas
        showNotification('Task deleted successfully!'); // Menampilkan notifikasi
      }
    });

    // Tombol selesai
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = todo.completed ? '❌' : '✅'; // Mengatur simbol berdasarkan status
    completeBtn.addEventListener('click', () => {
      toggleComplete(todo.id); // Mengubah status tugas
      showNotification(todo.completed ? 'Task marked as pending!' : 'Task marked as completed!'); // Menampilkan notifikasi
      completeBtn.innerHTML = todo.completed ? '✅' : '❌'; // Memperbarui simbol
    });

    // Menambahkan tombol ke div aksi
    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actionsCell.appendChild(actions); // Menambahkan div aksi ke sel

    // Menambahkan sel ke baris
    tr.appendChild(taskCell);
    tr.appendChild(dateCell);
    tr.appendChild(statusCell);
    tr.appendChild(actionsCell);

    todoList.appendChild(tr); // Menambahkan baris ke daftar tugas
  });
}

function deleteTodo(id) { // Fungsi untuk menghapus tugas
  todos = todos.filter(todo => todo.id !== id); // Menghapus tugas berdasarkan ID
  renderTodos(todos); // Menampilkan daftar tugas terbaru
}

function toggleComplete(id) { // Fungsi untuk mengubah status tugas
  const todo = todos.find(todo => todo.id === id); // Mencari tugas berdasarkan ID
  if (todo) { // Jika tugas ditemukan
    todo.completed = !todo.completed; // Mengubah status selesai
    renderTodos(todos); // Menampilkan daftar tugas terbaru
  }
}

function editTodo(id) { // Fungsi untuk mengedit tugas
  const todo = todos.find(todo => todo.id === id); // Mencari tugas berdasarkan ID
  if (todo) { // Jika tugas ditemukan
    taskInput.value = todo.task; // Mengisi input dengan tugas
    dateInput.value = todo.date; // Mengisi input dengan tanggal
    editingTodoId = id; // Menyimpan ID tugas yang sedang diedit
  }
}

filterSelect.addEventListener('change', function () { // Menangani perubahan filter
  const filter = filterSelect.value; // Mengambil nilai filter
  let filteredTodos; // Variabel untuk menyimpan tugas yang difilter

  if (filter === 'completed') { // Jika filter adalah tugas selesai
    filteredTodos = todos.filter(todo => todo.completed); // Mengambil tugas selesai
  } else if (filter === 'pending') { // Jika filter adalah tugas pending
    filteredTodos = todos.filter(todo => !todo.completed); // Mengambil tugas pending
  } else {
    filteredTodos = todos; // Mengambil semua tugas
  }

  renderTodos(filteredTodos); // Menampilkan tugas yang difilter
});

// Fungsi untuk menghapus semua tugas
deleteAllButton.addEventListener('click', function() {
  if (confirm('Are you sure you want to delete all tasks?')) { // Konfirmasi sebelum menghapus semua
    todos = []; // Mengosongkan array tugas
    renderTodos(todos); // Menampilkan daftar tugas terbaru
    showNotification('All tasks deleted successfully!'); // Menampilkan notifikasi
  }
});