defmodule MagnetissimoWeb.TorrentLive do
  use MagnetissimoWeb, :live_view

  alias Magnetissimo.Torrents

  @impl true
  def mount(params, _session, socket) do
    torrent = Torrents.get_torrent!(params["torrent_id"])
    {:ok, assign(socket, :torrent, torrent)}
  end


  @impl true
  def handle_event("download_torrent", %{"torrent" => name}, socket) do

    # Crear la carpeta y su estructura completa si no existe
    ruta_carpeta = "/home/aleaguilar/Descargas/#{name}/"
    File.mkdir_p(ruta_carpeta)

    # Ejecutar el script de Node.js
    case System.cmd("node", ["/home/aleaguilar/Escritorio/proyecto_labo/automatizacion/script_de_automizacion.js", name, ruta_carpeta]) do
      {output, 0} ->
        IO.puts("Éxito: #{output}")
      {output, _} ->
        IO.puts("Error: #{output}")
      error ->
        IO.puts("Error inesperado: #{inspect(error)}")
    end

    {:noreply, socket}
  end
end
