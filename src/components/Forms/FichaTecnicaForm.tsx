import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFichas, updateFichas } from "@/api/endpoints/fichastecnicas";
import { useFetchInsumos } from "@/hooks/api/useFetchInsumos";

const formSchema = z.object({
  name: z.string().min(3, "Nome do prato é obrigatório").max(100),
  sku: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  is_active: z.boolean().default(true),

  ingredients: z
    .array(
      z.object({
        ingredient_id: z.number().min(1, "Ingrediente é obrigatório"),
        quantity: z.string().min(1, "Quantidade é obrigatória"),
        notes: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

interface FichaTecnicaFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function FichaTecnicaForm({ onSuccess, initialData }: FichaTecnicaFormProps) {
  const { toast } = useToast();
  const { insumos } = useFetchInsumos(1);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      sku: "",
      price: "",
      is_active: true,
      ingredients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const mutationEdit = useMutation({
    mutationFn: updateFichas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
      toast({
        title: "Ficha técnica atualizada!",
        description: "A ficha técnica foi atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar ficha técnica",
        description: "Ocorreu um erro ao tentar atualizar a ficha técnica.",
        variant: "destructive",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: createFichas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
      toast({
        title: "Ficha técnica adicionada!",
        description: "A ficha técnica foi adicionada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar ficha técnica",
        description: "Ocorreu um erro ao tentar adicionar a ficha técnica.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      name: values.name,
      sku: values.sku || null,
      price: parseFloat(values.price),
      is_active: values.is_active,
      recipe:
        values.ingredients.length > 0
          ? {
              version: "v1",
              items: values.ingredients.map((ing) => ({
                ingredient_id: ing.ingredient_id,
                quantity: parseFloat(ing.quantity),
                notes: ing.notes || null,
              })),
            }
          : null,
    };

    if (initialData) {
      mutationEdit.mutate({ ...payload, id: initialData.id });
    } else {
      mutation.mutate(payload);
    }
    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Seção: Prato (Dish) */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Prato</CardTitle>
            <CardDescription>Dados básicos do prato no cardápio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Prato *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Feijoada Completa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PRATO-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Venda (R$) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="45.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Prato Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">Prato disponível no cardápio</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Receita</CardTitle>
            <CardDescription>Adicione os ingredientes e suas quantidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">Nenhum ingrediente adicionado</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ ingredient_id: 0, quantity: "", notes: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Ingrediente
                </Button>
              </div>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Ingrediente {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.ingredient_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ingrediente</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          defaultValue={field.value ? String(field.value) : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            {insumos.map((ingredient) => (
                              <SelectItem key={ingredient.id} value={String(ingredient.id)}>
                                {ingredient.name} ({ingredient.unit})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`ingredients.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: picado, cortado em cubos..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {fields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => append({ ingredient_id: 0, quantity: "", notes: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Ingrediente
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" className="bg-gradient-primary">
            {initialData ? "Atualizar" : "Criar"} Prato
          </Button>
        </div>
      </form>
    </Form>
  );
}
