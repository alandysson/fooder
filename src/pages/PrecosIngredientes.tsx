import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, DollarSign, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PrecoIngredienteForm } from "@/components/Forms/PrecoIngredienteForm";
import { useToast } from "@/hooks/use-toast";
import { useFetchPrecos } from "@/hooks/api/useFetchPrecos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePreco } from "@/api/endpoints/precos";
import { usePagination } from "@/hooks/use-pagination";

const PrecosIngredientes = () => {
  const [open, setOpen] = useState(false);
  const [editingPreco, setEditingPreco] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { precos, totalPages } = useFetchPrecos(currentPage);
  const paginationRange = usePagination({ currentPage, totalPages });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePreco,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["precos"] });
      toast({
        title: "Preço excluído",
        description: "O preço do ingrediente foi removido com sucesso.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Erro ao excluir preço",
        description: "Ocorreu um erro ao tentar excluir o preço.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (preco: any) => {
    setEditingPreco(preco);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingPreco(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Preços de Ingredientes</h1>
            <p className="text-muted-foreground">Gerencie os preços dos ingredientes por fornecedor</p>
          </div>
          <Button
            className="bg-gradient-primary shadow-md hover:shadow-lg transition-all"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Preço
          </Button>
          <Dialog open={open} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPreco ? "Editar Preço" : "Adicionar Novo Preço"}</DialogTitle>
                <DialogDescription>
                  {editingPreco
                    ? "Atualize os dados do preço"
                    : "Preencha os dados do novo preço de ingrediente"}
                </DialogDescription>
              </DialogHeader>
              <PrecoIngredienteForm onSuccess={handleCloseDialog} initialData={editingPreco} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Lista de Preços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Buscar por ingrediente ou fornecedor..." className="pl-10" />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingrediente</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Válido De</TableHead>
                    <TableHead>Válido Até</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {precos.map((preco) => (
                    <TableRow key={preco.id}>
                      <TableCell className="font-medium">{preco.ingredient.name}</TableCell>
                      <TableCell>{preco.supplier.name}</TableCell>
                      <TableCell>R$ {Number(preco.price).toFixed(2)}</TableCell>
                      <TableCell>{preco.purchase_unit}</TableCell>
                      <TableCell>{Number(preco.purchase_unit_quantity).toFixed(2)}</TableCell>
                      <TableCell>{new Date(preco.valid_from).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{new Date(preco.valid_to).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(preco)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(preco.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {paginationRange.map((pageNumber, index) => (
                      <PaginationItem key={index}>
                        {pageNumber === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber as number);
                            }}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este preço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default PrecosIngredientes;
